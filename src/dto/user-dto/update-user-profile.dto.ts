import { IsSwaggerString } from 'src/decorator/swagger.decorator';

export class UpdateUserProfileDto {
  @IsSwaggerString({ default: 'thanhtung38', maxLength: 50 }, false)
  readonly name: string;

  @IsSwaggerString({ maxLength: 50 }, false)
  readonly avatar: string;
}
