import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSnapshotEntity } from './user-snapshot.entity/user-snapshot.entity';
import { AlertEntity } from './alert.entity/alert.entity';
import { CallLogEntity } from './call-log.entity/call-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSnapshotEntity, AlertEntity, CallLogEntity]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
