import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { Permission } from '../role/permission.entity';
import { User } from './user.entity';

@Entity(EntityNameConst.USER_LOG)
export class UserLog extends AbstractCreatedIdEntity {
  @DBColumn({ type: 'jsonb', name: 'metadata' })
  metadata: any;

  @DBColumn({ type: 'varchar', name: 'comment', nullable: true })
  comment: string;

  @DBColumn({ type: 'int', name: 'permission_id' })
  permissionId: number;

  @DBColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.userLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
