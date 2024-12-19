import { SearchExamDto } from 'src/dto/exam/search-exam.dto';
import { EXAM } from 'src/entities/exam/exam.entity';
import { ConditionWhere } from 'src/types/query.type';
import { ILike } from 'typeorm';

export class ExamHelper {
  static getFilterSearchExam = (q: SearchExamDto): ConditionWhere<EXAM> => {
    let userWhere: ConditionWhere<EXAM> = {};
    userWhere = {
      ...(q.name && { name: ILike(`%${q.name}%`) }),
      ...(q.classRoomId && { classRoomId: q.classRoomId }),
      ...(q.creatorId && { creatorId: q.creatorId }),
      ...(q.private && { private: q.private }),
    };

    return { ...userWhere };
  };
}
