import { Transform } from 'class-transformer';
import { IsSwaggerEnum, IsSwaggerString } from 'src/decorator/swagger.decorator';
import { PageOptionsDto } from '../paginate.dto';
import { AppStatus } from 'src/types/common';

export class SearchUserDto extends PageOptionsDto {
  @IsSwaggerString({}, false)
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsSwaggerEnum({ enum: AppStatus }, false)
  readonly status: AppStatus;
}
