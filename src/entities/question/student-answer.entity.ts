import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { ExamAttempt } from '../exam/exam-attempt.entity';
import { Question } from './question.entity';

@Entity(EntityNameConst.STUDENT_ANSWER)
export class StudentAnswer extends AbstractTimeEntity {
  @DBColumn({
    name: 'exam_attempt_id',
    type: 'int',
    nullable: true,
  })
  examAttemptId: number;

  @DBColumn({
    name: 'question_id',
    type: 'int',
  })
  questionId: number;

  @DBColumn({
    name: 'selected_answers',
    type: 'int',
    array: true,
  })
  selectedAnswers: number[];

  @DBColumn({
    name: 'answered_at',
    type: 'timestamptz',
    nullable: true,
  })
  answeredAt: string;
  // RELATIONSHIP

  @ManyToOne(() => Question, (question) => question.studentAnswers)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => ExamAttempt, (examAttempt) => examAttempt.studentAnswers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_attempt_id' })
  examAttempt: ExamAttempt;
}
