import { RoleCode } from 'src/constant/role-code';
import { IsSwaggerEnum, IsSwaggerString } from 'src/decorator/swagger.decorator';

export class RegisterDto {
  @IsSwaggerString({ default: 'username' })
  readonly username: string;

  @IsSwaggerString({ default: '123456' })
  readonly password: string;

  @IsSwaggerString({}, false)
  readonly email: string;

  @IsSwaggerString({}, false)
  readonly phoneNumber: string;

  @IsSwaggerEnum({ enum: RoleCode }, false)
  readonly roleCode: typeof RoleCode;
}
