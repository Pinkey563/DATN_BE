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

@Injectable()
export class ClassroomService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createClassroom(userId: number, body: CreateClassroomDto, permissionCode) {
    const isExistByName = await HelperUtils.existByName(ClassRoom, body.name, 'name');
    if (isExistByName) throw new AppExistedException('name', body);

    const isPermission = await PermissionHelper.isPermissionChange(userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const classroom = new ClassRoom();

    classroom.name = body.name;
    classroom.teacherId = userId;
    classroom.description = body.description;
    classroom.thumbnailPath = body.thumbnailPath;
    classroom.classCode = body.classCode || HelperUtils.generateRandomClassCode();
    classroom.isTeacherCreated = true;

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
    const classroom = await ClassRoom.findOne({ where: { id, teacherId: user.userId } });
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
}
