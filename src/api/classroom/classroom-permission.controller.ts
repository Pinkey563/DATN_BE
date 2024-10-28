import { EntityNameConst } from 'src/constant/entity-name';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { ClassRoomAction, ClassRoomSummary } from './classroom-permission.interface';
import { Body, Post, Put, Req, Param } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { ClassRoom } from 'src/entities/class/classroom.entity';
import { CreateClassroomDto, UpdateClassroomDto } from 'src/dto/classroom-dto/create-classroom.dto';
import { RequestAuth } from 'src/dto/common-request.dto';

@IsAuthController(EntityNameConst.CLASSROOM, true)
export class ClassRoomPermissionController implements Record<ClassRoomAction, any> {
  constructor(private readonly classroomService: ClassroomService) {}
  classroom__JoinClass: any;
  classroom__LeaveClass: any;
  classroom__ApproveClass: any;

  @Post('/')
  @ApiHandleResponse({
    type: ClassRoom,
    summary: ClassRoomSummary.CREATE_CLASS,
  })
  async [ClassRoomAction.CREATE_CLASS](@Req() req: RequestAuth, @Body() body: CreateClassroomDto) {
    return await this.classroomService.createClassroom(req.user.userId, body, ClassRoomAction.CREATE_CLASS);
  }

  @Put('/:id')
  @ApiHandleResponse({
    summary: ClassRoomSummary.UPDATE_CLASS,
    type: Boolean,
  })
  async [ClassRoomAction.UPDATE_CLASS](
    @Req() req: RequestAuth,
    @Param('id') id: number,
    @Body() body: UpdateClassroomDto,
  ) {
    return await this.classroomService.updateById(id, req.user, body, ClassRoomAction.UPDATE_CLASS);
  }
}
