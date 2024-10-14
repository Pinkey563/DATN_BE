import { Permission } from 'src/entities/role/permission.entity';

export enum UserAction {
  GetMyProfile = 'user__GetMyProfile',
  UpdateMyProfile = 'user__UpdateMyProfile',
}

export const UserSummary: Record<keyof typeof UserAction, string> = {
  GetMyProfile: 'Get user profile by JWT',
  UpdateMyProfile: 'Update user profile by JWT',
};

export const UserPermission: Partial<Permission>[] = Object.keys(UserAction).map((key) => ({
  code: UserAction[key],
  name: UserSummary[key],
}));
