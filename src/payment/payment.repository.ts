import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentRepository {
  constructor(
    @Inject('paymentDataSource')
    private readonly dataSource: DataSource,
  ) {}

  // Raw query methods for payment database operations
  async executeRawQuery(query: string, parameters: any[] = []): Promise<any> {
    return this.dataSource.query(query, parameters);
  }

  // Payment database operations will be implemented here
}
