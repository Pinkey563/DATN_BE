import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { AppStatus } from 'src/types/common';
import { VocabularyTypeConst } from 'src/types/vocabulary';
import { StringUtil } from 'src/utils/string';
import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClassRoom } from '../class/classroom.entity';
import { AbstractTimeEntity } from '../entity.interface';
import { User } from '../user/user.entity';
import { Topic } from './topic.entity';
import { VocabularyView } from './vocabulary-view.entity';

@Entity(EntityNameConst.VOCABULARY)
export class Vocabulary extends AbstractTimeEntity {
  @DBColumn({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @DBColumn({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @DBColumn({
    name: 'topic_id',
    type: 'int',
  })
  topicId: number;

  @DBColumn({
    name: 'vocabulary_type',
    type: 'enum',
    enum: VocabularyTypeConst,
    default: VocabularyTypeConst.WORD,
  })
  vocabularyType: VocabularyTypeConst;

  @DBColumn({
    name: 'classroom_id',
    type: 'int',
    nullable: true,
  })
  classroomId: number;

  @DBColumn({
    name: 'creator_id',
    type: 'int',
  })
  creatorId: number;

  @DBColumn({
    name: 'images_path',
    type: 'varchar',
    nullable: true,
    array: true,
  })
  imagesPath: string[];

  @DBColumn({
    name: 'videos_path',
    type: 'varchar',
    nullable: true,
  })
  videoPath: string;

  @DBColumn({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @DBColumn({ name: 'status', type: 'enum', enum: AppStatus, default: AppStatus.PENDING })
  status: AppStatus;

  // RELATIONSHIP

  @ManyToOne(() => Topic, (topic) => topic.vocabulary, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @OneToMany(() => VocabularyView, (vocabularyType) => vocabularyType.vocabulary)
  vocabularyViews: VocabularyView[];

  @ManyToOne(() => User, (user) => user.vocabularies, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => ClassRoom, (classRoom) => classRoom.vocabularies, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;

  @BeforeInsert()
  handleBeforeInsert() {
    this.slug = StringUtil.createSlug(this.title);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.title);
  }
}
