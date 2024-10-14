import { RoleCode } from 'src/constant/role-code';
import { SearchUserDto } from 'src/dto/user-dto/search-user.dto';
import { User } from 'src/entities/user/user.entity';
import { ConditionWhere } from 'src/types/query.type';
import { FindOptionsSelect, ILike, In, Not } from 'typeorm';

export class UserHelper {
  static selectBasicInfo: FindOptionsSelect<User> = {
    id: true,
    username: true,
    name: true,
    avatar: true,
    slug: true,
  };

  static getFilterSearchUser = (q: SearchUserDto): ConditionWhere<User> => {
    let userWhere: ConditionWhere<User> = {};
    userWhere = {
      ...(q.name && { name: ILike(`%${q.name}%`) }),
      role: { code: Not(In([RoleCode.ADMIN, RoleCode.ADMIN_CODE_SERVICE])) },
    };

    return { ...userWhere };
  };
}
