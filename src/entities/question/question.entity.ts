import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { AppStatus } from 'src/types/common';
import { StringUtil } from 'src/utils/string';
import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ClassRoom } from '../class/classroom.entity';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { Answer } from './answer.entity';
import { StudentAnswer } from './student-answer.entity';
import { Topic } from '../vocabulary/topic.entity';

@Entity(EntityNameConst.QUESTION)
export class Question extends AbstractTimeEntity {
  @DBColumn({
    name: 'title',
    type: 'varchar',
  })
  title: string;

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
  classroomId: number;

  @DBColumn({
    name: 'topic_id',
    type: 'int',
    nullable: true,
  })
  topicId: number;

  @DBColumn({
    name: 'creator_id',
    type: 'int',
    nullable: true,
  })
  creatorId: number;

  @DBColumn({
    name: 'images_path',
    type: 'varchar',
    nullable: true,
    array: true,
  })
  imagesPath: string[];

  @DBColumn({
    name: 'video_path',
    type: 'varchar',
    nullable: true,
  })
  videoPath: string;

  @DBColumn({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @DBColumn({ name: 'status', type: 'enum', enum: AppStatus, default: AppStatus.PENDING })
  status: AppStatus;

  // RELATIONSHIP

  @ManyToOne(() => User, (User) => User.questions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.questions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;

  @OneToOne(() => StudentAnswer, (studentAnswer) => studentAnswer.question)
  studentAnswer: StudentAnswer;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToOne(() => Topic, (topic) => topic.questions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @BeforeInsert()
  handleBeforeInsert() {
    this.slug = StringUtil.createSlug(this.title);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.title);
  }
}
