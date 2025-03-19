import { EntityNameConst } from 'src/constant/entity-name';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractIdEntity } from '../entity.interface';
import { RolePermission } from './role-permission.entity';
import { User } from '../user/user.entity';

@Entity(EntityNameConst.ROLE)
export class Role extends AbstractIdEntity {
  @Column({ type: 'varchar', name: 'code', unique: true })
  code: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
