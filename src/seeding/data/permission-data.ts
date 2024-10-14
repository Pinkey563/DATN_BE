import { UploadPermission } from 'src/api/upload/upload-permission.interface';
import { UserPermission } from 'src/api/user/user.permission.interface';
import { Permission } from 'src/entities/role/permission.entity';

export const PermissionData: Partial<Permission>[] = [...UserPermission, ...UploadPermission];
