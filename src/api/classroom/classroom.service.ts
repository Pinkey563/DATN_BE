import { ClassStudent } from './../../entities/class/class-student.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateClassroomDto, UpdateClassroomDto } from 'src/dto/classroom-dto/create-classroom.dto';
import { ClassRoom } from 'src/entities/class/classroom.entity';
import { PermissionHelper } from 'src/helper/permisson-helper.service';
import { App404Exception, AppException, AppExistedException } from 'src/middleware/app-error-handler';
import { HelperUtils } from 'src/utils/helpers';
import { DataSource } from 'typeorm';
import { ClassRoomAction } from './classroom-permission.interface';
import { CacheUser } from 'src/dto/common-request.dto';
import { CondUtil } from 'src/utils/condition';
import { ERROR_MSG } from 'src/constant/error';
import { RoleHelper } from 'src/helper/role-helper.service';
import { SearchClassroomDto } from 'src/dto/classroom-dto/search-classroom.dto';
import { PageDto } from 'src/dto/paginate.dto';
import { ClassroomHelper } from 'src/helper/classroom-helper.service';
import { QueryUtil } from 'src/utils/query';
import { GenerateUtil } from 'src/utils/generate';
import { User } from 'src/entities/user/user.entity';
import { AppStatus } from 'src/types/common';

@Injectable()
export class ClassroomService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  search = async (query: SearchClassroomDto): Promise<PageDto<ClassRoom>> => {
    const [data, itemCount] = await ClassRoom.findAndCount({
      select: {
        id: true,
        name: true,
        createdAt: true,
        description: true,
        thumbnailPath: true,
        status: true,
        classLevel: true,
        teacherId: true,
        classCode: true,
        slug: true,
        teacher: {
          id: true,
          name: true,
        },
      },
      where: ClassroomHelper.getFilterSearchClassroom(query),
      relations: { teacher: true },
      order: QueryUtil.getSort(query.orderBy, query.sortBy),
      skip: query.skip,
      take: query.take,
    });

    return GenerateUtil.paginate({ data, itemCount, query });
  };

  getAllStudent = async (classroomId: number, cacheUser: CacheUser, query, permissionCode): Promise<any> => {
    const isPermission = await PermissionHelper.isPermissionChange(cacheUser.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const [data, itemCount] = await ClassStudent.findAndCount({
      select: {
        id: true,
        studentId: true,
        student: {
          id: true,
          username: true,
          email: true,
        },
      },
      relations: { student: true },
      where: { classroomId: classroomId },
    });

    return GenerateUtil.paginate({ data, itemCount, query });
  };

  async createClassroom(userId: number, body: CreateClassroomDto, permissionCode) {
    const isExistByName = await HelperUtils.existByName(ClassRoom, body.name, 'name');
    if (isExistByName) throw new AppExistedException('name', body);

    const isPermission = await PermissionHelper.isPermissionChange(userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    if (body.teacherId) {
      const teacher = await User.findOneBy({ id: body.teacherId, role: { code: 'TEACHER' } });
      if (!teacher) throw new App404Exception('teacherId', { teacherId: body.teacherId });
    }

    const userRole = await RoleHelper.getRoleByUserId(userId);

    const classroom = new ClassRoom();

    classroom.name = body.name;
    classroom.teacherId = body.teacherId;
    classroom.description = body.description;
    classroom.thumbnailPath = body.thumbnailPath;
    classroom.classCode = body.classCode || HelperUtils.generateRandomClassCode();
    classroom.isTeacherCreated = true;

    if (userRole.code === 'ADMIN') {
      classroom.isTeacherCreated = false;
    }

    await classroom.save();
    return classroom;
  }

  getById = async (id: number): Promise<ClassRoom> => {
    const classRoom = await ClassRoom.findOne({
      select: {
        teacher: {
          id: true,
          username: true,
        },
      },
      where: { id },
      relations: { teacher: true },
    });
    if (!classRoom) throw new App404Exception('id', { id });
    return classRoom;
  };

  updateById = async (
    id: number,
    user: CacheUser,
    body: UpdateClassroomDto,
    permissionCode: string,
  ): Promise<ClassRoom> => {
    let classroom;
    if (user.roleCode === 'ADMIN') {
      classroom = await ClassRoom.findOne({ where: { id } });
    } else {
      classroom = await ClassRoom.findOne({ where: { id, teacherId: user.userId } });
    }
    if (!classroom) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    CondUtil.saveIfChanged(classroom, body, ['name', 'description', 'thumbnailPath']);

    if (!!body.status && body.status !== classroom.status) {
      const isPermission = await PermissionHelper.isPermissionChange(user.userId, ClassRoomAction.APPROVE_CLASS);
      if (!isPermission) throw new AppException(ERROR_MSG.PERMISSION_DENIED);
      classroom.status = body.status;
    }

    await classroom.save();
    return classroom;
  };

  deleteById = async (id: number, user: CacheUser, permissionCode): Promise<ClassRoom> => {
    const userRole = await RoleHelper.getRoleByUserId(user.userId);
    if (userRole.code === 'ADMIN') {
      const classroom = await ClassRoom.findOne({ where: { id } });
      if (!classroom) throw new App404Exception('id', { id });
      await classroom.remove();
      return classroom;
    }

    const classroom = await ClassRoom.findOne({ where: { id, teacherId: user.userId } });
    if (!classroom) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    await classroom.remove();
    return classroom;
  };

  joinClass = async (id: number, user: CacheUser, body, permissionCode): Promise<any> => {
    const classroom = await ClassRoom.findOne({ where: { id, status: AppStatus.APPROVED } });
    if (!classroom) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const student = await User.findOne({ where: { studentProfile: { studentCode: body.studentCode } } });
    if (!student) throw new App404Exception('userId', { userId: body.studentCode });

    const classStudent = new ClassStudent();

    classStudent.classroomId = classroom.id;
    classStudent.studentId = student.id;

    await classStudent.save();
    return true;
  };

  leaveClass = async (id: number, user: CacheUser, body, permissionCode): Promise<any> => {
    const classroom = await ClassRoom.findOne({ where: { id } });
    if (!classroom) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const student = await User.findOne({ where: { studentProfile: { studentCode: body.studentCode } } });
    const classStudent = await ClassStudent.findOne({ where: { classroomId: classroom.id, studentId: student.id } });
    if (!classStudent) throw new App404Exception('studentId', { studentId: body.studentId });

    await classStudent.remove();
    return true;
  };
}
