import { IsSwaggerString } from 'src/decorator/swagger.decorator';

export class LoginDto {
  @IsSwaggerString({ default: 'dev_admin' })
  readonly username: string;

  @IsSwaggerString({ default: '123456' })
  readonly password: string;
}
