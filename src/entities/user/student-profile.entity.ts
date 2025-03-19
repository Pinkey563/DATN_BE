import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { User } from './user.entity';

@Entity(EntityNameConst.STUDENT_PROFILE)
export class StudentProfile extends AbstractCreatedIdEntity {
  @DBColumn({ type: 'varchar', name: 'student_code' })
  studentCode: string;

  @DBColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.studentProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
