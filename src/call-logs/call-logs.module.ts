import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLogsController } from './controllers/call-logs.controller';
import { CallLogsService } from './services/call-logs.service';
import { CallLogsRepository } from './repositories/call-logs.repository';
import { CallLogEntity } from '../entities/call-log.entity/call-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallLogEntity])],
  controllers: [CallLogsController],
  providers: [CallLogsService, CallLogsRepository],
  exports: [CallLogsService, CallLogsRepository],
})
export class CallLogsModule {}
