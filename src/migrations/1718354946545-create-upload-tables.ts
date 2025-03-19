import { EntityNameConst } from 'src/constant/entity-name';
import { MigrationConst } from 'src/constant/migration';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUploadTables1718354946545 implements MigrationInterface {
  private uploadTable = new Table({
    name: EntityNameConst.UPLOAD,
    columns: [
      MigrationConst.createdAtColumn,
      MigrationConst.varcharColumn('path', { isPrimary: true }),
      MigrationConst.booleanColumn('is_active', { default: false }),
      MigrationConst.intColumn('creator_id'),
    ],
  });

  private uploadCleanHistoryTable = new Table({
    name: EntityNameConst.UPLOAD_CLEAN_HISTORY,
    columns: [
      MigrationConst.idPrimaryColumn,
      MigrationConst.timestamptzColumn('start_at'),
      MigrationConst.timestamptzColumn('end_at'),
      MigrationConst.intColumn('total_success'),
      MigrationConst.intColumn('total_error'),
    ],
  });

  private uploadForeignKey: TableForeignKey[] = [
    MigrationConst.foreignKey('creator_id', EntityNameConst.USER, { onDelete: 'SET NULL' }),
  ];
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.uploadTable, true);
    await queryRunner.createTable(this.uploadCleanHistoryTable, true);

    await queryRunner.createForeignKeys(this.uploadTable, this.uploadForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.uploadTable, this.uploadForeignKey);

    await queryRunner.dropTable(this.uploadTable, true);
    await queryRunner.dropTable(this.uploadCleanHistoryTable, true);
  }
}
