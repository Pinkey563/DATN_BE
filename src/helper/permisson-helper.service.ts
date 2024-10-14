import { Permission } from 'src/entities/role/permission.entity';

export class PermissionHelper {
  static getPermissionByCode = async (code): Promise<Permission> => {
    return await Permission.findOneBy({ code });
  };
}
