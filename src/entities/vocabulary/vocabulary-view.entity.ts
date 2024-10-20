import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractCreatedIdEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity(EntityNameConst.VOCABULARY_VIEW)
export class VocabularyView extends AbstractCreatedIdEntity {
  @DBColumn({
    name: 'student_id',
    type: 'int',
  })
  studentId: string;

  @DBColumn({
    name: 'vocabulary_id',
    type: 'int',
  })
  vocabularyId: string;

  // RELATIONSHIP

  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.vocabularyViews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @ManyToOne(() => User, (user) => user.vocabularyViews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
