# NestJS Starter

A NestJS 12 starter for modular backend services, with centralized configuration, structured logging, standardized error responses, API versioning, request validation, multi-database access, caching, and email infrastructure.

## Technology Stack

- NestJS 12, TypeScript 6, and SWC
- Prisma 7, TypeORM, and Mongoose
- PostgreSQL 17, MySQL 8.4, and MongoDB 7.0
- Cache Manager with in-memory and Redis-backed storage
- Winston logging and a global exception filter
- Nodemailer with a safe JSON transport by default
- Jest and Supertest
- Docker Compose services for PostgreSQL, two MySQL instances, two MongoDB instances, Redis, Redis Insight, and Adminer

## Local Development

```bash
pnpm install
cp .env.example .env.development
pnpm docker:up
pnpm db:migrate
pnpm start:dev
```

The default API URL is `http://localhost:3000/api/v1`. If `PORT` is overridden in `.env.development`, use the configured port instead.

PostgreSQL is available on `localhost:5432`. The two MySQL instances use ports `3306` and `3307`, the two MongoDB instances use ports `27017` and `27018`, and Redis uses port `6379`. Redis Insight is available at `http://localhost:5540`, and Adminer is available at `http://localhost:8080`.

With `TENANT_MODE=false`, the application uses Prisma with PostgreSQL. When `TENANT_MODE=true`, the `x-tenant-id` request header selects an implementation through the repository abstraction:

- `default`, `prisma2`: Prisma with PostgreSQL
- `prisma1`: Prisma with MySQL on port `3307`
- `typeorm1`: TypeORM with MySQL on port `3306`
- `typeorm2`: TypeORM with MySQL on port `3307`
- `typeorm3`: TypeORM with PostgreSQL
- `mongo`, `mongo1`: Mongoose with the two MongoDB instances

## Common Commands

```bash
pnpm run build
pnpm test
pnpm test:e2e
pnpm db:generate
pnpm db:migrate
pnpm db:push:mysql
pnpm db:studio
pnpm docker:down
```

## Environment Configuration

The application loads `.env.<NODE_ENV>` before `.env`. The Prisma CLI follows the same precedence so migrations and the Nest application resolve the same database connection.

- `DATABASE_URL`: PostgreSQL connection string
- `MYSQL_DATABASE_URL`: Prisma MySQL connection string
- `TENANT_MODE`: Enables repository selection based on `x-tenant-id`
- `REDIS_ON`: Uses Redis for Cache Manager when enabled; otherwise uses in-memory caching
- `MAIL_ON`: Connects to SMTP when enabled; otherwise generates JSON email output
- `PREFIX`, `VERSION`: API prefix and URI versions
- `ERROR_FILTER`, `LOG_ON`: Global exception filtering and file logging switches

Do not commit real `.env` files. The repository only tracks `.env.example`.
