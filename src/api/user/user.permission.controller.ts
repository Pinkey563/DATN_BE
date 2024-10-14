import { Body, Get, Put, Req } from '@nestjs/common';
import { EntityNameConst } from 'src/constant/entity-name';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { RequestAuth } from 'src/dto/common-request.dto';
import { UpdateUserProfileDto } from 'src/dto/user-dto/update-user-profile.dto';
import { User } from 'src/entities/user/user.entity';
import { UserAction, UserSummary } from './user.permission.interface';
import { UserService } from './user.service';

@IsAuthController(`${EntityNameConst.USER}`, true)
export class UserPermissionController implements Record<UserAction, any> {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @ApiHandleResponse({ type: User, summary: UserSummary.GetMyProfile })
  async [UserAction.GetMyProfile](@Req() req: RequestAuth) {
    return await this.userService.getProfile(req.user);
  }

  @Put('/profile')
  @ApiHandleResponse({ type: User, summary: UserSummary.GetMyProfile })
  async [UserAction.UpdateMyProfile](@Req() req: RequestAuth, @Body() body: UpdateUserProfileDto) {
    return await this.userService.updateProfile(req.user, body, UserAction.UpdateMyProfile);
  }
}
