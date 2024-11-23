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
import { ChangeUserPasswordDto, UpdateUserProfileDto } from 'src/dto/user-dto/update-user-profile.dto';
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
import { DateUtil } from 'src/utils/date';
import { GenerateUtil } from 'src/utils/generate';
import { HashUtil } from 'src/utils/hash';
import { HelperUtils } from 'src/utils/helpers';
import { QueryUtil } from 'src/utils/query';
import { DataSource, FindOptionsWhere, Not } from 'typeorm';
import { StudentProfile } from './../../entities/user/student-profile.entity';
import { MailService } from './MailService';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private dataSource: DataSource,
    private readonly mailService: MailService, // Service gửi email
  ) {}

  async getProfileById(userId, whereCustom: FindOptionsWhere<User> = {}) {
    const user = await User.findOne({
      select: {
        ...UserHelper.selectBasicInfo,
        createdAt: true,
        updatedAt: true,
        status: true,
        address: true,
        birthday: true,
      },
      where: { id: userId, role: { code: Not(RoleCode.ADMIN) }, ...whereCustom },
      relations: { role: true },
    });
    if (!user) throw new App404Exception('userId', { userId });
    const userReturn = {
      ...user,
      role: user.role.code,
    };
    return userReturn;
  }

  async getProfile({ userId }: CacheUser) {
    return await this.getProfileById(userId, { role: {} });
  }

  login = async (body: LoginDto) => {
    const user = await User.findOne({
      where: { email: body.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) throw new App404Exception('email', body);
    const isPasswordMatch = body.password === HashUtil.aesDecrypt(user.password);
    if (!isPasswordMatch) throw new AppException(ERROR_MSG.PASSWORD_NOT_CORRECT);

    const data = await HashUtil.signAccessToken(user.id, user.email, this.jwtService);

    const cacheKeyAuth = GenerateUtil.keyAuth(data.payload);

    await this.cacheManager.del(cacheKeyAuth);

    return data;
  };

  register = async (body: RegisterDto) => {
    const isExistByName = await HelperUtils.existByName(User, body.email, 'email');
    if (isExistByName) throw new AppExistedException('email', body);

    const role = await RoleHelper.getRoleByCode(body.role);
    if (!role || role.code === RoleCode.ADMIN) throw new App404Exception('role', body);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = DateUtil.getTimeFuture(new Date(), 0, 2, 0); // Thời gian hết hạn dayjs().add(10, 'minute').toISOString();

    const userCacheKey = `user:${body.email}`;

    const bodyCache = {
      ...body,
      role,
    };

    await this.cacheManager.set(userCacheKey, JSON.stringify({ body: bodyCache, otp, expiry }), { ttl: 10 * 60 });

    await this.mailService.sendMail(body.email, 'Your OTP Code', `Your OTP is: ${otp}`);

    return true;
  };

  async verify(email: string, otpNum: number): Promise<string> {
    const userCacheKey = `user:${email}`;
    const cachedData: any = await this.cacheManager.get(userCacheKey);

    if (!cachedData) throw new AppException(ERROR_MSG.AUTH_OTP_EXPIRED);
    // ;

    const { body, otp: cachedOtp, expiry } = JSON.parse(cachedData as string);

    if (DateUtil.isAfterOrEqual(new Date(), new Date(expiry))) throw new Error('OTP expired.');
    if (cachedOtp !== otpNum) throw new AppException(ERROR_MSG.AUTH_OTP_NOT_MATCH);

    // Lưu vào cơ sở dữ liệu (ví dụ dùng TypeORM)

    const user = new User();
    if (body.role.code == RoleCode.TEACHER) {
      user.status = AppStatus.PENDING;
    }
    user.username = body.username;
    user.name = body.name;
    user.password = HashUtil.aesEncrypt(body.password);
    user.email = body.email;
    user.phoneNumber = body.phoneNumber;

    user.roleId = body.role.id;

    await user.save();

    if (body.role.code === RoleCode.STUDENT) {
      const studentCode = UserHelper.generateStudentCode(user.id);
      const studentProfile = new StudentProfile();
      studentProfile.studentCode = studentCode;
      studentProfile.userId = user.id;
      await studentProfile.save();
    }
    // Xóa Redis sau khi xác minh thành công
    await this.cacheManager.del(userCacheKey);

    return 'Verify successfully';
  }

  updateProfile = async ({ userId }: CacheUser, body: UpdateUserProfileDto, permissionCode: string): Promise<any> => {
    const user = await User.findOneBy({ id: userId });
    if (!user) throw new App404Exception('userId', { userId });

    const oldUser = JSON.stringify(user);

    const uploadKeys = ['avatarLocation'];
    const listOldPaths = ArrUtil.getOldPathEntityFromBody({ entity: user, body, uploadKeys });

    if (CondUtil.diffAndVail(body.name, user.name)) {
      user.name = body.name;
    }

    if (CondUtil.diffAndVail(body.avatarLocation, user.avatarLocation)) {
      user.avatarLocation = body.avatarLocation;
    }

    if (CondUtil.diffAndVail(body.address, user.address)) {
      user.address = body.address;
    }

    if (CondUtil.diffAndVail(body.birthday, user.birthday)) {
      user.birthday = body.birthday;
    }

    if (CondUtil.diffAndVail(body.gender, user.gender)) {
      user.gender = body.gender;
    }

    if (CondUtil.diffAndVail(body.phoneNumber, user.phoneNumber)) {
      user.phoneNumber = body.phoneNumber;
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
        isSupperAdmin: true,
        status: true,
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

  approveUser = async (userId: number, id, permissionCode) => {
    const user = await User.findOneBy({ id });
    if (!user) throw new App404Exception('userId', { userId: id });
    const isPermission = await PermissionHelper.isPermissionChange(userId, permissionCode);
    if (!isPermission) throw new AppException(ERROR_MSG.PERMISSION_DENIED);
    user.status = AppStatus.APPROVED;

    await user.save();
    return true;
  };

  changePassword = async ({ userId }: CacheUser, body: ChangeUserPasswordDto) => {
    const user = await User.findOneBy({ id: userId });
    if (!user) throw new App404Exception('userId', { userId });

    const isMatch = await HashUtil.comparePassword(body.oldPassword, user.password);
    if (!isMatch) throw new AppException(ERROR_MSG.PASSWORD_NOT_CORRECT);

    if (body.newPassword !== body.confirmPassword) throw new AppException(ERROR_MSG.PASSWORD_NOT_MATCH);
    user.password = HashUtil.aesEncrypt(body.newPassword);
    await user.save();
    return true;
  };
}
