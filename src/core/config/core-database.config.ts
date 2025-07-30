import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
config();

export const coreDbConfig = {
  host: process.env.DB_HOST_CORE_READ || process.env.DB_HOST,
  user: process.env.DB_USER_CORE_READ || process.env.DB_USER,
  password: process.env.DB_PASSWORD_CORE_READ || process.env.DB_PASSWORD,
  name: process.env.DB_NAME_CORE_READ || process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT_CORE_READ || process.env.DB_PORT) || 5432,
};

export const coreDataSourceConfig: DataSourceOptions = {
  name: 'coreDataSource',
  type: 'postgres',
  host: coreDbConfig.host,
  port: coreDbConfig.port,
  username: coreDbConfig.user,
  password: coreDbConfig.password,
  database: coreDbConfig.name,
  synchronize: false,
  logging: false,
  entities: ['dist/core/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
};

export default registerAs('coreDatabase', () => {
  return coreDbConfig;
});
