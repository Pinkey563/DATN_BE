import { Permission } from 'src/entities/role/permission.entity';

export enum ClassRoomAction {
  CREATE_CLASS = 'classroom__CreateClass',
  JOIN_CLASS = 'classroom__JoinClass',
  LEAVE_CLASS = 'classroom__LeaveClass',
  UPDATE_CLASS = 'classroom__UpdateClass',
  APPROVE_CLASS = 'classroom__ApproveClass',
}

export const ClassRoomSummary: Record<keyof typeof ClassRoomAction, string> = {
  CREATE_CLASS: 'Create a new class',
  JOIN_CLASS: 'Join a class',
  LEAVE_CLASS: 'Leave a class',
  UPDATE_CLASS: 'Update a class',
  APPROVE_CLASS: 'Approve a class',
};

export const ClassRoomPermission: Partial<Permission>[] = Object.keys(ClassRoomAction).map((key) => ({
  code: ClassRoomAction[key],
  name: ClassRoomSummary[key],
}));
