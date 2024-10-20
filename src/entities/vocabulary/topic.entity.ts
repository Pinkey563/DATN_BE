import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { Entity, OneToMany } from 'typeorm';
import { AbstractTimeEntity } from '../entity.interface';
import { Vocabulary } from './vocabulary.entity';
import { Question } from '../question/question.entity';

@Entity(EntityNameConst.TOPIC)
export class Topic extends AbstractTimeEntity {
  @DBColumn({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  // RELATIONSHIP

  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.topic)
  vocabulary: Vocabulary;

  @OneToMany(() => Question, (question) => question.topic)
  questions: Question[];
}
