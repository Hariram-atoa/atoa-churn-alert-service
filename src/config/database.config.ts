import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserSnapshotEntity } from '../entities/user-snapshot.entity/user-snapshot.entity';
import { AlertEntity } from '../entities/alert.entity/alert.entity';
import { CallLogEntity } from '../entities/call-log.entity/call-log.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'atoa_churn_alert'),
  entities: [UserSnapshotEntity, AlertEntity, CallLogEntity],
  synchronize: false, // Set to false for production
  logging: false, // process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  ssl: configService.get<string>('DB_HOST', '').includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false,
});
