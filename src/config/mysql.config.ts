import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('mysql', () => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USERNAME || 'general-user',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DBNAME || 'nestjs-base-template',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  entities: [path.join(__dirname, '../**/*.entity.{js,ts}')],
  synchronize: false,
  logging: false,
}));
