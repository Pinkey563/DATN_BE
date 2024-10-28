import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { BeforeUpdate, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { ClassStudent } from './class-student.entity';
import { User } from '../user/user.entity';
import { Vocabulary } from '../vocabulary/vocabulary.entity';
import { Question } from '../question/question.entity';
import { AppStatus } from 'src/types/common';
import { EXAM } from '../exam/exam.entity';
import { StringUtil } from 'src/utils/string';

@Entity(EntityNameConst.CLASSROOM)
export class ClassRoom extends AbstractTimeEntity {
  @DBColumn({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @DBColumn({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: true,
  })
  thumbnailPath: string;

  @DBColumn({
    name: 'teacher_id',
    type: 'int',
    nullable: true,
  })
  teacherId: number;

  @DBColumn({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @DBColumn({
    name: 'class_code',
    type: 'varchar',
    nullable: true,
  })
  classCode: string;

  @DBColumn({
    name: 'is_teacher_created',
    type: 'boolean',
    default: false,
  })
  isTeacherCreated: boolean;

  @DBColumn({
    name: 'status',
    type: 'enum',
    enum: AppStatus,
    default: AppStatus.PENDING,
  })
  status: AppStatus;

  @DBColumn({
    name: 'slug',
    type: 'varchar',
    nullable: true,
  })
  slug: string;

  // RELATIONSHIP

  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.classroom)
  vocabularies: Vocabulary;

  @OneToMany(() => ClassStudent, (classStudent) => classStudent.classroom)
  classStudents: ClassStudent[];

  @OneToOne(() => User, (User) => User.classroomTeacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Question, (question) => question.classroom)
  questions: Question;

  @OneToMany(() => EXAM, (exam) => exam.classroom)
  exams: EXAM[];

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.name);
  }
}
