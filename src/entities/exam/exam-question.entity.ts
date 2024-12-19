import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { Question } from '../question/question.entity';
import { EXAM } from './exam.entity';

@Entity(EntityNameConst.EXAM_QUESTION)
export class ExamQuestion extends AbstractCreatedIdEntity {
  @DBColumn({ type: 'int', name: 'question_id' })
  questionId: number;

  @DBColumn({ type: 'int', name: 'exam_id' })
  examId: number;

  @ManyToOne(() => EXAM, (exam) => exam.questions)
  @JoinColumn({ name: 'exam_id' })
  exam: EXAM;

  @ManyToOne(() => Question, (question) => question.exams)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
