import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSnapshotEntity } from './user-snapshot.entity/user-snapshot.entity';
import { AlertEntity } from './alert.entity/alert.entity';
import { CallLogEntity } from './call-log.entity/call-log.entity';
import { BusinessCategorySeverityEntity } from './business-category-severity.entity/business-category-severity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSnapshotEntity,
      AlertEntity,
      CallLogEntity,
      BusinessCategorySeverityEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
