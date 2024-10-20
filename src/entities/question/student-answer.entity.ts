import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { Answer } from './answer.entity';
import { Question } from './question.entity';
import { ExamAttempt } from '../exam/exam-attempt.entity';

@Entity(EntityNameConst.STUDENT_ANSWER)
export class StudentAnswer extends AbstractTimeEntity {
  @DBColumn({
    name: 'exam_attempt_id',
    type: 'int',
    nullable: true,
  })
  examAttemptId: string;

  @DBColumn({
    name: 'question_id',
    type: 'int',
  })
  questionId: number;

  @DBColumn({
    name: 'answer_id',
    type: 'int',
  })
  answerId: number;

  @DBColumn({
    name: 'answered_at',
    type: 'timestamptz',
    nullable: true,
  })
  answeredAt: string;
  // RELATIONSHIP

  @OneToOne(() => Answer, (answer) => answer.studentAnswer)
  @JoinColumn({ name: 'answer_id' })
  answers: Answer;

  @OneToOne(() => Question, (question) => question.studentAnswer)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToOne(() => ExamAttempt, (examAttempt) => examAttempt.studentAnswer)
  @JoinColumn({ name: 'exam_attempt_id' })
  examAttempt: ExamAttempt;
}
