import { Transform } from 'class-transformer';
import { IsSwaggerEnum, IsSwaggerNumber, IsSwaggerString } from 'src/decorator/swagger.decorator';
import { PageOptionsDto } from '../paginate.dto';
import { AppStatus } from 'src/types/common';
import { RoleCode } from 'src/constant/role-code';

export class SearchUserDto extends PageOptionsDto {
  @IsSwaggerString({}, false)
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsSwaggerEnum({ enum: AppStatus }, false)
  readonly status: AppStatus;

  @IsSwaggerEnum({ enum: RoleCode, default: RoleCode.STUDENT }, false)
  readonly roleCode: 'STUDENT' | 'TEACHER';
}

export class SearchUserStatisticDto extends PageOptionsDto {
  @IsSwaggerNumber({}, false)
  readonly userId: number;

  @IsSwaggerString({}, false)
  @Transform(({ value }) => value.trim())
  readonly name: string;
}

export class SearchStudentDto extends PageOptionsDto {
  @IsSwaggerString({}, false)
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsSwaggerNumber({}, false)
  readonly classRoomId: number;
}
