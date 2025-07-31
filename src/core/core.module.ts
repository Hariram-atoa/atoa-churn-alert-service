import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from './core.service';
import { CoreRepository } from './core.repository';
import { coreDataSourceConfig } from './config/core-database.config';
import { DataSource } from 'typeorm';
import { MerchantMapperService } from './services/merchant-mapper.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...coreDataSourceConfig,
      name: 'coreDataSource',
    }),
  ],
  providers: [
    CoreService,
    CoreRepository,
    MerchantMapperService,
    {
      provide: 'coreDataSource',
      useFactory: async () => {
        const dataSource = new DataSource(coreDataSourceConfig);
        await dataSource.initialize();
        return dataSource;
      },
    },
  ],
  exports: [CoreService, CoreRepository, MerchantMapperService],
})
export class CoreModule {}
