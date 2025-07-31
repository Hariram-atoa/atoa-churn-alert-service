import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../payment/payment.repository';
import { PAYMENT_QUERIES } from './raw-queries/payment.queries';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  async getMerchantPlanName(merchantId: string): Promise<any> {
    return this.paymentRepository.executeRawQuery(
      PAYMENT_QUERIES.GET_MERCHANT_PLAN_NAME,
      [merchantId],
    );
  }

  async getLastSixMonthsTransactionData(merchantId: string): Promise<any> {
    return this.paymentRepository.executeRawQuery(
      PAYMENT_QUERIES.GET_LAST_SIX_MONTH_TRANSACTION,
      [merchantId],
    );
  }
}
