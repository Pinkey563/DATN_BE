import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity(EntityNameConst.VOCABULARY_VIEW)
export class VocabularyView extends AbstractCreatedIdEntity {
  @DBColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @DBColumn({
    name: 'vocabulary_id',
    type: 'int',
  })
  vocabularyId: number;

  @DBColumn({
    name: 'last_viewed_at',
    type: 'timestamptz',
  })
  lastViewedAt: string;

  @DBColumn({
    name: 'view_count',
    type: 'int',
    default: 0,
  })
  viewCount: number;

  // RELATIONSHIP

  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.vocabularyViews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @ManyToOne(() => User, (user) => user.vocabularyViews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
