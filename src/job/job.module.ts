import { Module } from '@nestjs/common';
import { CronBackupDatabase } from './cron-backup-db';
import { CronCleanStorage } from './cron-clean-storage';

@Module({
  providers: [CronCleanStorage, CronBackupDatabase],
})
export class JobModule {}
