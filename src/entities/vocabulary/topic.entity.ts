import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClassRoom } from '../class/classroom.entity';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity(EntityNameConst.TOPIC)
export class Topic extends AbstractTimeEntity {
  @DBColumn({
    name: 'name',
    type: 'varchar',
    unique: true,
  })
  name: string;

  @DBColumn({
    name: 'classroom_id',
    type: 'int',
    nullable: true,
  })
  classroomId?: number;

  @DBColumn({
    name: 'image_location',
    type: 'varchar',
    nullable: true,
  })
  imageLocation: string;

  @DBColumn({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @DBColumn({
    name: 'creator_id',
    type: 'int',
    nullable: true,
  })
  creatorId?: number;

  @DBColumn({
    name: 'is_common',
    type: 'boolean',
    default: false,
  })
  isCommon: boolean;

  // RELATIONSHIP

  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.topic)
  vocabulary: Vocabulary;

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  classroom?: ClassRoom;

  @ManyToOne(() => User, (user) => user.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator?: User;
}
