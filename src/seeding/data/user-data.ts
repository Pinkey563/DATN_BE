import { User } from 'src/entities/user/user.entity';

export const DefaultAdminData: Partial<User>[] = [
  {
    email: 'dev_admin@gmail.com',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Dev Admin',
  },
  {
    email: 'test_admin@gmail.com',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Test Admin',
  },
];

export const DefaultTeacherData: Partial<User>[] = [];

export const DefaultStudentData: Partial<User>[] = [];

export const DefaultVolunteerData: Partial<User>[] = [];

export const adminCodeServiceData: Partial<User>[] = [
  {
    email: 'admin_code_service@gmail.com',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Code Server Admin',
  },
];
