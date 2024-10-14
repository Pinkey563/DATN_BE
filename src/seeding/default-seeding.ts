import { UploadAction } from 'src/api/upload/upload-permission.interface';
import { UserAction } from 'src/api/user/user.permission.interface';
import { connectSource } from 'src/config/database.config';
import { RoleCode } from 'src/constant/role-code';
import { Permission } from 'src/entities/role/permission.entity';
import { RolePermission } from 'src/entities/role/role-permission.entity';
import { Role } from 'src/entities/role/role.entity';
import { User } from 'src/entities/user/user.entity';
import { RoleHelper } from 'src/helper/role-helper.service';
import { PermissionData } from './data/permission-data';
import { RoleData } from './data/role-data';
import {
  adminCodeServiceData,
  DefaultAdminData,
  DefaultStudentData,
  DefaultTeacherData,
  DefaultVolunteerData,
} from './data/user-data';
import { seedingEntity } from './seeding-utils';
import { Token } from 'src/entities/token.entity';
import { TokenData } from './data/token-data';

const PermissionAdminRoleCode = [...Object.values(UserAction), ...Object.values(UploadAction)];

const PermissionUserRoleCode = [UserAction.GetMyProfile, UserAction.UpdateMyProfile, UploadAction.File];

const seedingRolePermission = async (permissionCodes, roleCode) => {
  console.log(`======== SEEDING ${RolePermission.name} =========`);
  for (const code of permissionCodes) {
    const role = await RoleHelper.getRoleByCode(roleCode);
    if (!role) {
      console.log(`======== ${Role.name} code ${roleCode} is not exist`);
      continue;
    }

    const permission = await Permission.findOneBy({ code });
    if (!permission) {
      console.log(`======== ${Permission.name} code ${code} is not exist`);
      continue;
    }

    const rolePermission = await RolePermission.findOneBy({ roleId: role.id, permissionId: permission.id });

    if (rolePermission) {
      console.log(`======== ${RolePermission.name} roleId-${role.id} permissionId-${permission.id} is exist =========`);
      continue;
    }

    await RolePermission.save({ roleId: role.id, permissionId: permission.id } as Partial<RolePermission>);
  }
};

const defaultSeeding = async () => {
  await connectSource();

  await seedingEntity(Token, TokenData, 'code');

  await seedingEntity(Permission, PermissionData, 'code');

  await seedingEntity(Role, RoleData, 'code');

  const adminRole = await RoleHelper.getRoleByCode(RoleCode.ADMIN);
  const teacherRole = await RoleHelper.getRoleByCode(RoleCode.TEACHER);
  const studentRole = await RoleHelper.getRoleByCode(RoleCode.STUDENT);
  const volunteerRole = await RoleHelper.getRoleByCode(RoleCode.VOLUNTEER);
  const admCodeServiceRole = await RoleHelper.getRoleByCode(RoleCode.ADMIN_CODE_SERVICE);

  await seedingEntity(
    User,
    DefaultAdminData.map((item) => ({ ...item, roleId: adminRole.id })),
    'username',
  );

  await seedingEntity(
    User,
    DefaultTeacherData.map((item) => ({ ...item, roleId: teacherRole.id })),
    'username',
  );

  await seedingEntity(
    User,
    DefaultStudentData.map((item) => ({ ...item, roleId: studentRole.id })),
    'username',
  );

  await seedingEntity(
    User,
    DefaultVolunteerData.map((item) => ({ ...item, roleId: volunteerRole.id })),
    'username',
  );

  await seedingEntity(
    User,
    adminCodeServiceData.map((item) => ({ ...item, roleId: admCodeServiceRole.id })),
    'username',
  );

  await seedingRolePermission(PermissionAdminRoleCode, RoleCode.ADMIN);
  await seedingRolePermission(PermissionUserRoleCode, RoleCode.TEACHER);
  await seedingRolePermission(PermissionUserRoleCode, RoleCode.STUDENT);
  await seedingRolePermission(PermissionUserRoleCode, RoleCode.VOLUNTEER);
  await seedingRolePermission(PermissionUserRoleCode, RoleCode.ADMIN_CODE_SERVICE);

  process.exit(1);
};

defaultSeeding();
