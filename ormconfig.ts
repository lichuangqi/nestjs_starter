import { DataSource, type DataSourceOptions } from 'typeorm';
import { parse, type DotenvParseOutput } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { toBoolean } from './src/utils/format';

export function getEnv(path: string): DotenvParseOutput {
  return existsSync(path) ? parse(readFileSync(path)) : {};
}

export function buildConnectionOptions(): DataSourceOptions {
  const config = {
    ...getEnv('.env'),
    ...getEnv(`.env.${process.env.NODE_ENV || 'development'}`),
    ...process.env,
  };

  return {
    type: 'mysql',
    host: config.DB_HOST || 'localhost',
    port: Number(config.DB_PORT || 3306),
    username: config.DB_USERNAME || 'root',
    password: config.DB_PASSWORD || 'example',
    database: config.DB_DATABASE || 'testdb',
    entities: [join(process.cwd(), 'src/**/*.entity{.ts,.js}')],
    synchronize: toBoolean(config.DB_SYNC),
  };
}

export default new DataSource(buildConnectionOptions());
