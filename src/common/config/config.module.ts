import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import Joi from 'joi';

const envFilePath = [`.env.${process.env.NODE_ENV || `development`}`, '.env'];
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().ip(),
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
