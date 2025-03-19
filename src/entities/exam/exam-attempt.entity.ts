import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { StudentAnswer } from '../question/student-answer.entity';
import { User } from '../user/user.entity';
import { EXAM } from './exam.entity';

@Entity(EntityNameConst.EXAM_ATTEMPT)
export class ExamAttempt extends AbstractCreatedIdEntity {
  @DBColumn({
    name: 'student_id',
    type: 'int',
  })
  studentId: number;

  @DBColumn({
    name: 'exam_id',
    type: 'int',
  })
  examId: number;

  @DBColumn({
    name: 'score',
    type: 'numeric',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  score: number;

  @DBColumn({
    name: 'is_finished',
    type: 'boolean',
    default: false,
  })
  isFinished: boolean;

  // RELATIONSHIP

  @ManyToOne(() => User, (User) => User.examAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => EXAM, (exam) => exam.examAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: EXAM;

  @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.examAttempt)
  studentAnswers: StudentAnswer[];
}
