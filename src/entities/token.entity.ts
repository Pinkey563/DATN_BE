import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity } from 'typeorm';
import { AbstractCreatedIdEntity } from './entity.interface';

@Entity(EntityNameConst.TOKEN)
export class Token extends AbstractCreatedIdEntity {
  @DBColumn({ type: 'varchar', name: 'name' })
  name: string;

  @DBColumn({ type: 'varchar', name: 'code', unique: true })
  code: string;

  // RELATION ------------
}
