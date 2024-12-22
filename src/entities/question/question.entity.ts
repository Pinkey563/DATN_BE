import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { FileType, QuestionType } from 'src/types/classroom';
import { StringUtil } from 'src/utils/string';
import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClassRoom } from '../class/classroom.entity';
import { AbstractTimeEntity } from '../entity.interface';
import { ExamQuestion } from '../exam/exam-question.entity';
import { User } from '../user/user.entity';
import { Answer } from './answer.entity';
import { StudentAnswer } from './student-answer.entity';

@Entity(EntityNameConst.QUESTION)
export class Question extends AbstractTimeEntity {
  @DBColumn({
    name: 'content',
    type: 'varchar',
  })
  content: string;

  @DBColumn({
    name: 'explanation',
    type: 'varchar',
    nullable: true,
  })
  explanation: string;

  @DBColumn({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @DBColumn({
    name: 'classroom_id',
    type: 'int',
    nullable: true,
  })
  classRoomId: number;

  @DBColumn({
    name: 'creator_id',
    type: 'int',
    nullable: true,
  })
  creatorId: number;

  @DBColumn({
    name: 'image_location',
    type: 'varchar',
    nullable: true,
  })
  imageLocation: string;

  @DBColumn({
    name: 'video_location',
    type: 'varchar',
    nullable: true,
  })
  videoLocation: string;

  @DBColumn({
    name: 'file_type',
    type: 'enum',
    enum: FileType,
    default: FileType.EXISTED,
  })
  fileType: FileType;

  @DBColumn({
    name: 'question_type',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_ANSWERS,
  })
  questionType: QuestionType;

  @DBColumn({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  // RELATIONSHIP

  @ManyToOne(() => User, (User) => User.questions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.questions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;

  @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.question)
  studentAnswers: StudentAnswer[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answerResList: Answer[];

  @OneToMany(() => ExamQuestion, (exam) => exam.question)
  exams: ExamQuestion[];

  @BeforeInsert()
  handleBeforeInsert() {
    this.slug = StringUtil.createSlug(this.content);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.content);
  }
}
