import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.development') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'dawwar',
  password: process.env.DB_PASSWORD ?? 'dawwar_dev_2024',
  database: process.env.DB_DATABASE ?? 'dawwar_db',
  synchronize: false,
  logging: true,
  entities: [path.resolve(__dirname, '../entities/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, './migrations/*{.ts,.js}')],
});
