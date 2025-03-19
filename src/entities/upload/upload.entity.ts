import { EntityNameConst } from 'src/constant/entity-name';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractCreatedEntity } from '../entity.interface';
import { User } from '../user/user.entity';

@Entity(EntityNameConst.UPLOAD)
export class Upload extends AbstractCreatedEntity {
  @Column({ primary: true, name: 'path', type: 'varchar', unique: true })
  path: string;

  @Column({ type: 'boolean', name: 'is_active', default: false })
  isActive: boolean;

  @Column({ type: 'int', name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() => User, (User) => User.uploads, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;
}
