import { DataSource } from 'typeorm';
import { UserSnapshotEntity } from './src/entities/user-snapshot.entity/user-snapshot.entity';
import { AlertEntity } from './src/entities/alert.entity/alert.entity';
import { CallLogEntity } from './src/entities/call-log.entity/call-log.entity';
import { BusinessCategorySeverityEntity } from './src/entities/business-category-severity.entity/business-category-severity.entity';
import * as dotenv from 'dotenv';

// Load environment variables for TypeORM
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'atoa_churn_alert',
  entities: [
    UserSnapshotEntity,
    AlertEntity,
    CallLogEntity,
    BusinessCategorySeverityEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
