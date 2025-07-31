import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './controllers/alerts.controller';
import { AlertsService } from './services/alerts.service';
import { AlertsRepository } from './repositories/alerts.repository';
import { AlertEntity } from '../entities/alert.entity/alert.entity';
import { CallLogEntity } from '../entities/call-log.entity/call-log.entity';
import { CallLogsModule } from '../call-logs/call-logs.module';
import { CoreModule } from '../core/core.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlertEntity, CallLogEntity]),
    CallLogsModule, // Import to access CallLogsRepository
    CoreModule,
    PaymentModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsRepository],
  exports: [AlertsService],
})
export class AlertsModule {}
