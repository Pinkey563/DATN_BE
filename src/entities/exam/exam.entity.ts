import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { AppStatus } from 'src/types/common';
import { StringUtil } from 'src/utils/string';
import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { ExamAttempt } from './exam-attempt.entity';
import { ClassRoom } from '../class/classroom.entity';

@Entity(EntityNameConst.EXAM)
export class EXAM extends AbstractTimeEntity {
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
    name: 'creator_id',
    type: 'int',
  })
  creatorId: number;

  @DBColumn({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: true,
  })
  thumbnailPath: string;

  @DBColumn({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @DBColumn({ name: 'status', type: 'enum', enum: AppStatus, default: AppStatus.PENDING })
  status: AppStatus;

  // RELATIONSHIP

  @ManyToOne(() => User, (user) => user.exams, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.exams, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;

  @OneToMany(() => ExamAttempt, (examAttempt) => examAttempt.exam)
  examAttempts: ExamAttempt[];

  @BeforeInsert()
  handleBeforeInsert() {
    this.slug = StringUtil.createSlug(this.title);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.title);
  }
}
