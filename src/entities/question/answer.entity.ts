import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { Question } from './question.entity';
import { StudentAnswer } from './student-answer.entity';

@Entity(EntityNameConst.ANSWER)
export class Answer extends AbstractCreatedIdEntity {
  @DBColumn({
    name: 'content',
    type: 'varchar',
  })
  content: string;

  @DBColumn({
    name: 'question_id',
    type: 'int',
  })
  questionId: string;

  // RELATIONSHIP

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToOne(() => StudentAnswer, (studentAnswer) => studentAnswer.answers, { onDelete: 'CASCADE' })
  studentAnswer: StudentAnswer;
}
