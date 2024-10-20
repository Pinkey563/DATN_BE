import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { ClassRoom } from './classroom.entity';

@Entity(EntityNameConst.CLASS_STUDENT)
export class ClassStudent extends AbstractTimeEntity {
  @DBColumn({
    name: 'classroom_id',
    type: 'int',
  })
  classroomId: number;

  @DBColumn({
    name: 'student_id',
    type: 'int',
  })
  studentId: number;

  // RELATIONSHIP

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.classStudents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;

  @ManyToOne(() => User, (User) => User.classStudents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
