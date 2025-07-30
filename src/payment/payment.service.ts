import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../payment/payment.repository';
import { PAYMENT_QUERIES } from './raw-queries/payment.queries';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  // Payment business logic methods
  async getTransactionsByMerchant(
    merchantId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    return this.paymentRepository.executeRawQuery(
      PAYMENT_QUERIES.GET_TRANSACTIONS_BY_MERCHANT,
      [merchantId, startDate, endDate],
    );
  }

  async getGtvByPeriod(
    merchantId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    return this.paymentRepository.executeRawQuery(
      PAYMENT_QUERIES.GET_GTV_BY_PERIOD,
      [merchantId, startDate, endDate],
    );
  }

  async getPaymentMethods(merchantId: string, startDate: string): Promise<any> {
    return this.paymentRepository.executeRawQuery(
      PAYMENT_QUERIES.GET_PAYMENT_METHODS,
      [merchantId, startDate],
    );
  }
}
