import { Get, Param, Query } from '@nestjs/common';
import { EntityNameConst } from 'src/constant/entity-name';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { SearchClassroomDto } from 'src/dto/classroom-dto/search-classroom.dto';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from 'src/entities/vocabulary/vocabulary.entity';

@IsAuthController(EntityNameConst.VOCABULARY, false)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('/all')
  @ApiHandleResponse({
    summary: 'Get all vocabulary',
    type: Vocabulary,
  })
  async search(@Query() query: SearchClassroomDto) {
    return await this.vocabularyService.search(query);
  }

  @Get('/:id')
  @ApiHandleResponse({
    summary: 'Get vocabulary by id',
    type: Vocabulary,
  })
  async getProfileById(@Param('id') id: number) {
    return await this.vocabularyService.getById(id);
  }
}
