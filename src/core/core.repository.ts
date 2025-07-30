import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CoreRepository {
  constructor(
    @Inject('coreDataSource')
    private readonly dataSource: DataSource,
  ) {}

  // Raw query methods for core database operations
  async executeRawQuery(query: string, parameters: any[] = []): Promise<any> {
    return this.dataSource.query(query, parameters);
  }

  // Core database operations will be implemented here
}
