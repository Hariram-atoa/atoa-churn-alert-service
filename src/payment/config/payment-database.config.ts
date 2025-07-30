import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
config();

export const paymentDbConfig = {
  host: process.env.DB_HOST_PAYMENT_READ || process.env.DB_HOST,
  user: process.env.DB_USER_PAYMENT_READ || process.env.DB_USER,
  password: process.env.DB_PASSWORD_PAYMENT_READ || process.env.DB_PASSWORD,
  name: process.env.DB_NAME_PAYMENT_READ || process.env.DB_NAME,
  port:
    parseInt(process.env.DB_PORT_PAYMENT_READ || process.env.DB_PORT) || 5432,
};

export const paymentDataSourceConfig: DataSourceOptions = {
  name: 'paymentDataSource',
  type: 'postgres',
  host: paymentDbConfig.host,
  port: paymentDbConfig.port,
  username: paymentDbConfig.user,
  password: paymentDbConfig.password,
  database: paymentDbConfig.name,
  synchronize: false,
  logging: false,
  entities: ['dist/payment/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
};

export default registerAs('paymentDatabase', () => {
  return paymentDbConfig;
});
