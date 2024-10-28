import { Get, Param } from '@nestjs/common';
import { EntityNameConst } from 'src/constant/entity-name';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { User } from 'src/entities/user/user.entity';
import { ClassroomService } from './classroom.service';

@IsAuthController(EntityNameConst.CLASSROOM, false)
export class ClassroomController {
  constructor(private readonly classRoomService: ClassroomService) {}

  // @Get('/search')
  // @ApiHandleResponse({
  //   summary: 'Get data for author list',
  //   type: User,
  // })
  // async search(@Query() query: SearchUserDto) {
  //   return await this.classRoomService.search(query);
  // }

  @Get('/:id')
  @ApiHandleResponse({
    summary: 'Get classroom info by id',
    type: User,
  })
  async getProfileById(@Param('id') id: number) {
    return await this.classRoomService.getById(id);
  }
}
