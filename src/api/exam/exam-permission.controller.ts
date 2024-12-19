import { Body, Delete, Param, Post, Put, Req } from '@nestjs/common';
import { EntityNameConst } from 'src/constant/entity-name';
import { ApiHandleResponse } from 'src/decorator/api.decorator';
import { IsAuthController } from 'src/decorator/auth.decorator';
import { RequestAuth } from 'src/dto/common-request.dto';
import { CreateExamDto, UpdateExamDto } from 'src/dto/exam/create-exam.dto';
import { EXAM } from 'src/entities/exam/exam.entity';
import { ExamAction, ExamSummary } from './exam-permission.interface';
import { ExamService } from './exam.service';

@IsAuthController(EntityNameConst.EXAM, true)
export class ExamPermissionController implements Record<ExamAction, any> {
  constructor(private readonly examService: ExamService) {}

  @Post('/')
  @ApiHandleResponse({
    type: EXAM,
    summary: ExamSummary.CREATE_EXAM,
  })
  async [ExamAction.CREATE_EXAM](@Req() req: RequestAuth, @Body() body: CreateExamDto) {
    return await this.examService.create(req.user.userId, body, ExamAction.CREATE_EXAM);
  }

  @Put('/:id')
  @ApiHandleResponse({
    summary: ExamSummary.UPDATE_EXAM,
    type: Boolean,
  })
  async [ExamAction.UPDATE_EXAM](@Req() req: RequestAuth, @Param('id') id: number, @Body() body: UpdateExamDto) {
    return await this.examService.updateById(id, req.user, body, ExamAction.UPDATE_EXAM);
  }

  @Delete('/:id')
  @ApiHandleResponse({
    summary: ExamSummary.DELETE_EXAM,
    type: Boolean,
  })
  async [ExamAction.DELETE_EXAM](@Req() req: RequestAuth, @Param('id') id: number) {
    return await this.examService.deleteById(id, req.user, ExamAction.DELETE_EXAM);
  }
}
