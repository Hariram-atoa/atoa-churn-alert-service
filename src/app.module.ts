import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './entities/entities.module';
import { databaseConfig } from './config/database.config';
import { CommunicationModule } from './communication/communication.module';
import { AlertsModule } from './alerts/alerts.module';
import { CallLogsModule } from './call-logs/call-logs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EntitiesModule,
    CommunicationModule,
    AlertsModule,
    CallLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
