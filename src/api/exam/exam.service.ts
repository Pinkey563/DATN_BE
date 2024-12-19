import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Audit } from 'entity-diff';
import { ERROR_MSG } from 'src/constant/error';
import { CacheUser } from 'src/dto/common-request.dto';
import { CreateExamDto, UpdateExamDto } from 'src/dto/exam/create-exam.dto';
import { SearchExamDto } from 'src/dto/exam/search-exam.dto';
import { PageDto } from 'src/dto/paginate.dto';
import { ExamQuestion } from 'src/entities/exam/exam-question.entity';
import { EXAM } from 'src/entities/exam/exam.entity';
import { ExamHelper } from 'src/helper/exam-helper.service';
import { PermissionHelper } from 'src/helper/permisson-helper.service';
import { RoleHelper } from 'src/helper/role-helper.service';
import { App404Exception, AppException, AppExistedException } from 'src/middleware/app-error-handler';
import { CondUtil } from 'src/utils/condition';
import { GenerateUtil } from 'src/utils/generate';
import { HelperUtils } from 'src/utils/helpers';
import { QueryUtil } from 'src/utils/query';
import { DataSource, In } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  search = async (query: SearchExamDto): Promise<PageDto<EXAM>> => {
    const [data, itemCount] = await EXAM.findAndCount({
      select: {
        id: true,
        name: true,
        classRoomId: true,
        description: true,
        createdAt: true,
        creatorId: true,
        numberOfQuestions: true,
        private: true,
        classroom: {
          id: true,
          name: true,
          classLevel: true,
        },
      },
      where: ExamHelper.getFilterSearchExam(query),
      relations: { classroom: true },
      order: QueryUtil.getSort(query.orderBy, query.sortBy),
      skip: query.skip,
      take: query.take,
    });

    return GenerateUtil.paginate({ data, itemCount, query });
  };

  async create(userId: number, body: CreateExamDto, permissionCode) {
    const isExistByName = await HelperUtils.existByName(EXAM, body.name, 'name');
    if (isExistByName) throw new AppExistedException('name', body);

    const isPermission = await PermissionHelper.isPermissionChange(userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const exam = new EXAM();
    await this.dataSource.transaction(async (txEntityManager) => {
      exam.name = body.name;
      exam.description = body.description;
      exam.classRoomId = body.classRoomId;
      exam.private = body.private;
      exam.creatorId = userId;
      exam.numberOfQuestions = body.numberOfQuestions;
      exam.thumbnailPath = body.thumbnailPath;

      await txEntityManager.save(exam);

      if (body.questionIds && body.questionIds.length > 0) {
        const examQuestions = body.questionIds.map((questionId) => {
          const examQuestion = new ExamQuestion();
          examQuestion.questionId = questionId;
          examQuestion.examId = exam.id;
          return examQuestion;
        });

        // Lưu examQuestions
        await txEntityManager.save(ExamQuestion, examQuestions);
      }
    });

    return await this.getById(exam.id);
  }

  getById = async (id: number): Promise<EXAM> => {
    const exam = await EXAM.findOne({
      select: {
        classroom: {
          id: true,
          name: true,
          classLevel: true,
        },
        creator: {
          id: true,
          name: true,
        },
        questions: {
          id: true,
        },
      },
      where: { id },
      relations: { classroom: true, creator: true, questions: true },
    });
    if (!exam) throw new App404Exception('id', { id });
    return exam;
  };

  updateById = async (id: number, user: CacheUser, body: UpdateExamDto, permissionCode: string): Promise<EXAM> => {
    const exam = await EXAM.findOne({ where: { id }, relations: { questions: true } });
    if (!exam) throw new App404Exception('id', { id });

    if (body.name != exam.name) {
      const isExistByName = await HelperUtils.existByName(EXAM, body.name, 'name');
      if (isExistByName) throw new AppExistedException('name', body);
    }

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const oldExam = JSON.stringify(exam);
    const oldQuestion = JSON.stringify(exam.questions.map((q) => q.id));

    CondUtil.saveIfChanged(exam, body, ['name', 'thumbnailPath', 'numberOfQuestions', 'description']);
    const audit = new Audit();
    const diffAnswer = audit.diff(JSON.parse(oldExam), JSON.parse(JSON.stringify(exam)));
    const diffQuestion = audit.diff(JSON.parse(oldQuestion), JSON.parse(JSON.stringify(body.questionIds)));
    if (!diffAnswer.length && !diffQuestion.length) throw new AppException(ERROR_MSG.HAVE_NOT_ANY_CHANGE);

    const currentQuestionIds = exam.questions.map((q) => q.questionId);

    const questionIdsToDelete = currentQuestionIds.filter((id) => !body.questionIds.includes(id));
    const questionIdsToAdd = body.questionIds.filter((id) => !currentQuestionIds.includes(id));

    await Promise.all([
      questionIdsToDelete.length && ExamQuestion.delete({ examId: exam.id, questionId: In(questionIdsToDelete) }),
      questionIdsToAdd.length &&
        questionIdsToAdd.map(async (questionId) => {
          const examQuestion = new ExamQuestion();
          examQuestion.questionId = questionId;
          examQuestion.examId = exam.id;
          await examQuestion.save();
        }),
    ]);
    exam.numberOfQuestions = body.questionIds.length;
    await exam.save();
    return await this.getById(exam.id);
  };

  deleteById = async (id: number, user: CacheUser, permissionCode): Promise<any> => {
    let exam;
    const userRole = await RoleHelper.getRoleByUserId(user.userId);
    if (userRole.code === 'ADMIN') {
      exam = await EXAM.findOne({ where: { id } });
    } else {
      exam = await EXAM.findOne({ where: { id, creatorId: user.userId } });
    }

    if (!exam) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    await exam.remove();
    return true;
  };
}
