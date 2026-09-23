import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({
  path: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
});

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    url: env('MYSQL_DATABASE_URL'),
  },
});
