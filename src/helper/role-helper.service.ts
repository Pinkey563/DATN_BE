import { Role } from 'src/entities/role/role.entity';

export class RoleHelper {
  static getRoleByCode = async (code): Promise<Role> => {
    return await Role.findOneBy({ code });
  };
}
