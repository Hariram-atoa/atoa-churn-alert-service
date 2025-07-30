import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { paymentDataSourceConfig } from './config/payment-database.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...paymentDataSourceConfig,
      autoLoadEntities: true,
    }),
  ],
  providers: [
    PaymentService,
    PaymentRepository,
    {
      provide: 'paymentDataSource',
      useFactory: () => {
        const dataSource = new DataSource(paymentDataSourceConfig);
        return dataSource;
      },
    },
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
