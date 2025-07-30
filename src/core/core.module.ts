import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from './core.service';
import { CoreRepository } from './core.repository';
import { coreDataSourceConfig } from './config/core-database.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...coreDataSourceConfig,
      autoLoadEntities: true,
    }),
  ],
  providers: [
    CoreService,
    CoreRepository,
    {
      provide: 'coreDataSource',
      useFactory: () => {
        const dataSource = new DataSource(coreDataSourceConfig);
        return dataSource;
      },
    },
  ],
  exports: [CoreService, CoreRepository],
})
export class CoreModule {}
