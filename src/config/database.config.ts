import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserSnapshotEntity } from '../entities/user-snapshot.entity/user-snapshot.entity';
import { AlertEntity } from '../entities/alert.entity/alert.entity';
import { CallLogEntity } from '../entities/call-log.entity/call-log.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'atoa_churn_alert',
  entities: [UserSnapshotEntity, AlertEntity, CallLogEntity],
  synchronize: false, // Set to false for production
  logging: false, // process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false,
};
