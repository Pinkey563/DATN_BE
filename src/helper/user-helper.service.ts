import { SearchUserDto, SearchUserStatisticDto } from 'src/dto/user-dto/search-user.dto';
import { UserStatistic } from 'src/entities/user/user-statistic.entity';
import { User } from 'src/entities/user/user.entity';
import { ConditionWhere } from 'src/types/query.type';
import { FindOptionsSelect, ILike } from 'typeorm';

export class UserHelper {
  static selectBasicInfo: FindOptionsSelect<User> = {
    id: true,
    username: true,
    name: true,
    email: true,
    phoneNumber: true,
    avatarLocation: true,
    gender: true,
    role: { code: true },
    slug: true,
  };

  static getFilterSearchUser = (q: SearchUserDto): ConditionWhere<User> => {
    let userWhere: ConditionWhere<User> = {};
    userWhere = {
      ...(q.name && { name: ILike(`%${q.name}%`) }),
      role: { code: q.roleCode },
      ...(q.status && { status: q.status }),
    };

    return { ...userWhere };
  };

  static generateStudentCode(studentId: number) {
    const year = new Date().getFullYear();
    const studentCode = `${year}${studentId.toString().padStart(4, '0')}`;
    return studentCode;
  }

  static getFilterSearchUserStatistic(query: SearchUserStatisticDto): ConditionWhere<UserStatistic> {
    let where: ConditionWhere<UserStatistic> = {};

    where = {
      ...(query.name && { name: ILike(`%${query.name}%`) }),
      ...(query.userId && { userId: query.userId }),
    };

    return { ...where };
  }
}
