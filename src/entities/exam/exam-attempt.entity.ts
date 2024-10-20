import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { EXAM } from './exam.entity';
import { StudentAnswer } from '../question/student-answer.entity';

@Entity(EntityNameConst.EXAM_ATTEMPT)
export class ExamAttempt extends AbstractCreatedIdEntity {
  @DBColumn({
    name: 'student_id',
    type: 'int',
  })
  studentId: string;

  @DBColumn({
    name: 'exam_id',
    type: 'int',
  })
  examId: string;

  @DBColumn({
    name: 'attempted_at',
    type: 'timestamptz',
    nullable: true,
  })
  attemptedAt: string;

  // RELATIONSHIP

  @ManyToOne(() => User, (User) => User.examAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => EXAM, (exam) => exam.examAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: EXAM;

  @OneToOne(() => StudentAnswer, (studentAnswer) => studentAnswer.examAttempt)
  studentAnswer: StudentAnswer;
}
