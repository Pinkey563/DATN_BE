import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Audit } from 'entity-diff';
import { ERROR_MSG } from 'src/constant/error';
import { RoleCode } from 'src/constant/role-code';
import { CacheUser } from 'src/dto/common-request.dto';
import { PageDto } from 'src/dto/paginate.dto';
import { LoginDto } from 'src/dto/user-dto/login.dto';
import { RegisterDto } from 'src/dto/user-dto/register.dto';
import { SearchUserDto } from 'src/dto/user-dto/search-user.dto';
import { UpdateUserProfileDto } from 'src/dto/user-dto/update-user-profile.dto';
import { Upload } from 'src/entities/upload/upload.entity';
import { UserLog } from 'src/entities/user/user-log.entity';
import { User } from 'src/entities/user/user.entity';
import { PermissionHelper } from 'src/helper/permisson-helper.service';
import { RoleHelper } from 'src/helper/role-helper.service';
import { UserHelper } from 'src/helper/user-helper.service';
import { App404Exception, AppException, AppExistedException } from 'src/middleware/app-error-handler';
import { AppStatus } from 'src/types/common';
import { ArrUtil } from 'src/utils/array';
import { CondUtil } from 'src/utils/condition';
import { GenerateUtil } from 'src/utils/generate';
import { HashUtil } from 'src/utils/hash';
import { HelperUtils } from 'src/utils/helpers';
import { QueryUtil } from 'src/utils/query';
import { DataSource, FindOptionsWhere, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private dataSource: DataSource,
  ) {}

  async getProfileById(userId, whereCustom: FindOptionsWhere<User> = {}) {
    const user = await User.findOne({
      select: {
        ...UserHelper.selectBasicInfo,
        coverPhoto: true,
        facebookUrl: true,
        createdAt: true,
        updatedAt: true,
        role: {
          code: true,
        },
      },
      where: { id: userId, role: { code: Not(RoleCode.ADMIN) }, ...whereCustom },
      relations: { role: true },
    });
    if (!user) throw new App404Exception('userId', { userId });
    return user;
  }

  async getProfile({ userId }: CacheUser) {
    return await this.getProfileById(userId, { role: {} });
  }

  login = async (body: LoginDto) => {
    const user = await User.findOne({
      where: { username: body.username },
      select: ['id', 'username', 'password'],
    });

    if (!user) throw new App404Exception('username', body);
    const isPasswordMatch = body.password === HashUtil.aesDecrypt(user.password);
    if (!isPasswordMatch) throw new AppException(ERROR_MSG.PASSWORD_NOT_CORRECT);

    const data = await HashUtil.signAccessToken(user.id, user.username, this.jwtService);

    const cacheKeyAuth = GenerateUtil.keyAuth(data.payload);

    await this.cacheManager.del(cacheKeyAuth);

    return data;
  };

  register = async (body: RegisterDto) => {
    const isExistByName = await HelperUtils.existByName(User, body.username, 'username');
    if (isExistByName) throw new AppExistedException('username', body);

    const role = await RoleHelper.getRoleByCode(body.roleCode);
    if (!role || role.code === RoleCode.ADMIN) throw new App404Exception('roleCode', body);

    const user = new User();
    if (role.code !== RoleCode.STUDENT) {
      user.status = AppStatus.PENDING;
    }
    user.username = body.username;
    user.password = HashUtil.aesEncrypt(body.password);
    user.email = body.email;
    user.phoneNumber = body.phoneNumber;

    user.roleId = role.id;

    await user.save();
    return true;
  };

  updateProfile = async ({ userId }: CacheUser, body: UpdateUserProfileDto, permissionCode: string): Promise<any> => {
    const user = await User.findOneBy({ id: userId });
    if (!user) throw new App404Exception('userId', { userId });

    const oldUser = JSON.stringify(user);

    const uploadKeys = ['avatar', 'coverPhoto'];
    const listOldPaths = ArrUtil.getOldPathEntityFromBody({ entity: user, body, uploadKeys });

    if (CondUtil.diffAndVail(body.name, user.name)) {
      user.name = body.name;
    }

    if (CondUtil.diffAndVail(body.avatar, user.avatar)) {
      user.avatar = body.avatar;
    }

    if (CondUtil.diffAndVail(body.coverPhoto, user.coverPhoto)) {
      user.coverPhoto = body.coverPhoto;
    }

    if (CondUtil.diffAndVail(body.facebookUrl, user.facebookUrl)) {
      user.facebookUrl = body.facebookUrl;
    }

    const permission = await PermissionHelper.getPermissionByCode(permissionCode);
    if (!permission) throw new App404Exception('permissionCode', { permissionCode });

    const audit = new Audit();
    const diff = audit.diff(JSON.parse(oldUser), JSON.parse(JSON.stringify(user)));
    if (!diff.length) throw new AppException(ERROR_MSG.HAVE_NOT_ANY_CHANGE);

    return await this.dataSource.transaction(async (txEntityManager) => {
      await txEntityManager.update(User, { id: user.id }, user);
      const userLog = new UserLog();
      userLog.metadata = JSON.stringify(diff);
      userLog.userId = user.id;
      userLog.permissionId = permission.id;
      await txEntityManager.save(userLog);

      const listPaths = ArrUtil.getPathsFromBody({ body, uploadKeys });

      listOldPaths.length && (await txEntityManager.update(Upload, listOldPaths, { isActive: false }));
      listPaths.length && (await txEntityManager.update(Upload, listPaths, { isActive: true }));

      return true;
    });
  };

  search = async (query: SearchUserDto): Promise<PageDto<User>> => {
    const [data, itemCount] = await User.findAndCount({
      select: {
        ...UserHelper.selectBasicInfo,
        coverPhoto: true,
        isSupperAdmin: true,
        createdAt: true,
        role: { code: true },
      },
      where: UserHelper.getFilterSearchUser(query),
      order: QueryUtil.getSort(query.orderBy, query.sortBy),
      skip: query.skip,
      take: query.take,
    });
    return GenerateUtil.paginate({ data, itemCount, query });
  };
}
