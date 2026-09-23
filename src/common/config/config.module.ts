import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import Joi from 'joi';

const envFilePath = [`.env.${process.env.NODE_ENV || `development`}`, '.env'];
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  TENANT_MODE: Joi.boolean().default(false),
  TENANT_DB_TYPE: Joi.string().default('prisma'),
  TENANT_DB_DEFAULT: Joi.string().default('prisma'),
  DB_TYPE: Joi.string().default('mysql'),
  DB_HOST: Joi.string().hostname().default('localhost'),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().default('root'),
  DB_PASSWORD: Joi.string().default('example'),
  DB_DATABASE: Joi.string().default('testdb'),
  DB_AUTOLOAD: Joi.boolean().default(true),
  DB_SYNC: Joi.boolean().default(false),
  REDIS_ON: Joi.boolean().default(false),
  REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),
  REDIS_TYPE: Joi.string().valid('single', 'cluster').default('single'),
  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_CLUSTER_HOST: Joi.string().optional(),
  REDIS_CLUSTER_PORT: Joi.string().optional(),
  CACHE_TYPE: Joi.string().valid('memory', 'redis').default('memory'),
  CACHE_MAX_ITEMS: Joi.number().integer().positive().default(100),
  CACHE_TTL: Joi.number().integer().min(0).default(60000),
  MAIL_ON: Joi.boolean().default(false),
  MAIL_HOST: Joi.string().hostname().default('localhost'),
  MAIL_PORT: Joi.number().port().default(1025),
  MAIL_USER: Joi.string().allow('').default(''),
  MAIL_PASSWORD: Joi.string().allow('').default(''),
  MAIL_FROM: Joi.string().default('NestJS Starter <noreply@example.com>'),
  CORS: Joi.boolean().default(false),
  PREFIX: Joi.string().default('api'),
  VERSION: Joi.string().optional(),
  ERROR_FILTER: Joi.boolean().default(true),
});
@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: schema,
    }),
  ],
})
export class ConfigModule {}
