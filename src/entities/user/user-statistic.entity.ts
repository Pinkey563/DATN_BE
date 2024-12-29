import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from './user.entity';

@Entity(EntityNameConst.USER_STATISTIC)
export class UserStatistic extends AbstractTimeEntity {
  @DBColumn({ type: 'int', name: 'total_classes_joined', default: 0 })
  totalClassesJoined: number;

  @DBColumn({ type: 'int', name: 'vocabulary_views', default: 0 })
  vocabularyViews: number;

  @DBColumn({ type: 'int', name: 'tests_completed', default: 0 })
  testsCompleted: number;

  @DBColumn({ type: 'numeric', name: 'average_score', default: 0, precision: 10, scale: 2 })
  averageScore: number;

  @DBColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.userLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
