import { Body, Get, Param, Post, Query } from '@nestjs/common';
import { EntityNameConst } from 'src/constant/entity-name';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { LoginResponse } from 'src/dto/common-response.dto';
import { LoginDto } from 'src/dto/user-dto/login.dto';
import { SearchUserDto } from 'src/dto/user-dto/search-user.dto';
import { User } from 'src/entities/user/user.entity';
import { UserService } from './user.service';
import { RegisterDto } from 'src/dto/user-dto/register.dto';

@IsAuthController(EntityNameConst.USER, false)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @ApiHandleResponse({
    summary: 'Login account with username password',
    type: LoginResponse,
  })
  async login(@Body() body: LoginDto) {
    return await this.userService.login(body);
  }

  @Get('/search')
  @ApiHandleResponse({
    summary: 'Get data for author list',
    type: User,
  })
  async search(@Query() query: SearchUserDto) {
    return await this.userService.search(query);
  }
  @Get('/:id')
  @ApiHandleResponse({
    summary: 'Get user info by id',
    type: User,
  })
  async getProfileById(@Param('id') id: number) {
    return await this.userService.getProfileById(id);
  }

  @Post('/register')
  @ApiHandleResponse({
    summary: 'register account with username password',
    type: RegisterDto,
  })
  async register(@Body() body: RegisterDto) {
    return await this.userService.register(body);
  }
}
