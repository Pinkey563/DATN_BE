import { Role } from 'src/entities/role/role.entity';
import { User } from 'src/entities/user/user.entity';

export class RoleHelper {
  static getRoleByCode = async (code): Promise<Role> => {
    return await Role.findOneBy({ code });
  };

  static getRoleByUserId = async (id): Promise<Role> => {
    const user = await User.findOne({
      where: { id },
      relations: { role: true },
    });
    return user?.role;
  };
}
