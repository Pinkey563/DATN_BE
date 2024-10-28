import { IsSwaggerEnum, IsSwaggerString } from 'src/decorator/swagger.decorator';
import { AppStatus } from 'src/types/common';

export class CreateClassroomDto {
  @IsSwaggerString({ default: 'name' })
  readonly name: string;

  @IsSwaggerString({ default: 'description' })
  readonly description: string;

  @IsSwaggerString({ default: 'thumbnail.jpg' })
  readonly thumbnailPath: string;

  @IsSwaggerString({ default: 'A1B2C3' })
  readonly classCode: string;
}

export class UpdateClassroomDto {
  @IsSwaggerString({}, false)
  readonly name: string;

  @IsSwaggerString({}, false)
  readonly description: string;

  @IsSwaggerString({}, false)
  readonly thumbnailPath: string;

  @IsSwaggerEnum({ enum: AppStatus }, false)
  readonly status: AppStatus;
}
