import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './entities/entities.module';
import { databaseConfig } from './config/database.config';
import { CommunicationModule } from './communication/communication.module';
import { AlertsModule } from './alerts/alerts.module';
import { CallLogsModule } from './call-logs/call-logs.module';
import { CoreModule } from './core/core.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => databaseConfig(configService),
      inject: [ConfigService],
    }),
    EntitiesModule,
    CommunicationModule,
    AlertsModule,
    CallLogsModule,
    CoreModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
