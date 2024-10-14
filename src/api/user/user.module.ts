import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserPermissionController } from './user.permission.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [UserService],
  controllers: [UserController, UserPermissionController],
})
export class UserModule {}
