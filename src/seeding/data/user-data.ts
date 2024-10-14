import { User } from 'src/entities/user/user.entity';

export const DefaultAdminData: Partial<User>[] = [
  {
    username: 'tunghust38',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Tran Thanh Tung',
    isSupperAdmin: true,
  },
  {
    username: 'dev_admin',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Dev Admin',
  },
  {
    username: 'test_admin',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Test Admin',
  },
];

export const DefaultTeacherData: Partial<User>[] = [
  {
    username: 'dev_teacher',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Dev Teacher',
  },
  {
    username: 'test_teacher',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Test Teacher',
  },
];

export const DefaultStudentData: Partial<User>[] = [
  {
    username: 'dev_student',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Dev Student',
  },
  {
    username: 'test_student',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Test Student',
  },
];

export const DefaultVolunteerData: Partial<User>[] = [
  {
    username: 'dev_volunteer',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Dev Volunteer',
  },
  {
    username: 'test_volunteer',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Test Volunteer',
  },
];

export const adminCodeServiceData: Partial<User>[] = [
  {
    username: 'admin_code_service',
    password: 'U2FsdGVkX1/l8FZ79Hb0toPjDVDRk0LTAlNFFntINaw=',
    name: 'Code Server Admin',
  },
];
