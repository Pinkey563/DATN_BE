import { IsSwaggerBoolean, IsSwaggerNumber, IsSwaggerString } from 'src/decorator/swagger.decorator';
import { PageOptionsDto } from '../paginate.dto';

export class SearchExamDto extends PageOptionsDto {
  @IsSwaggerString({}, false)
  readonly name: string;

  @IsSwaggerNumber({}, false)
  readonly classRoomId: number;

  @IsSwaggerNumber({}, false)
  readonly creatorId: number;

  @IsSwaggerBoolean({}, false)
  readonly private: boolean;
}
