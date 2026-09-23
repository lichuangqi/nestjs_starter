import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { catchError, defer, lastValueFrom } from 'rxjs';
import { PrismaClient as MySQLClient } from '../../generated/prisma-mysql/client';
import { PrismaClient as PgClient } from '../../generated/prisma-postgresql/client';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
import {
  PRISMA_CONNECTION_NAME,
  PRISMA_CONNECTIONS,
  PRISMA_MODULE_OPTIONS,
} from './prisma.constants';
import { getDBType, handleRetry } from './prisma.utils';

type PrismaConnection = PgClient | MySQLClient;

@Module({})
@Global()
export class PrismaCoreModule implements OnApplicationShutdown {
  private static connections: Record<string, PrismaConnection> = {};

  async onApplicationShutdown() {
    await Promise.all(
      Object.values(PrismaCoreModule.connections).map((connection) =>
        connection.$disconnect(),
      ),
    );
  }

  static forRoot(options: PrismaModuleOptions): DynamicModule {
    const providerName = options.name || PRISMA_CONNECTION_NAME;
    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: () => this.createConnection(options),
    };

    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider, this.connectionsProvider()],
      exports: [prismaClientProvider, PRISMA_CONNECTIONS],
    };
  }

  static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule {
    const providerName = options.name || PRISMA_CONNECTION_NAME;
    const prismaClientProvider: Provider = {
      provide: providerName,
      inject: [PRISMA_MODULE_OPTIONS],
      useFactory: (moduleOptions: PrismaModuleOptions) =>
        this.createConnection(moduleOptions),
    };

    return {
      module: PrismaCoreModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        prismaClientProvider,
        this.connectionsProvider(),
      ],
      exports: [prismaClientProvider, PRISMA_CONNECTIONS],
    };
  }

  private static async createConnection(
    options: PrismaModuleOptions,
  ): Promise<PrismaConnection> {
    const {
      url,
      retryAttempts = 10,
      retryDelay = 3000,
      connectionFactory,
      connectionErrorFactory,
    } = options;

    if (!url) throw new Error('Prisma database URL is required');
    if (this.connections[url]) return this.connections[url];

    return lastValueFrom(
      defer(async () => {
        if (this.connections[url]) return this.connections[url];

        const dbType = getDBType(url);
        const ClientClass: any = dbType === 'mysql' ? MySQLClient : PgClient;
        const adapter =
          dbType === 'mysql' ? new PrismaMariaDb(url) : new PrismaPg(url);
        if (dbType !== 'mysql' && dbType !== 'postgresql') {
          throw new Error(`Unsupported database type: ${dbType}`);
        }

        const client = connectionFactory
          ? await connectionFactory({ adapter, ...options.options }, ClientClass)
          : new ClientClass({ adapter });
        await client.$connect();
        this.connections[url] = client as PrismaConnection;
        return this.connections[url];
      }).pipe(
        handleRetry(retryAttempts, retryDelay),
        catchError((error: unknown) => {
          if (connectionErrorFactory) {
            throw connectionErrorFactory(error as never);
          }
          throw error;
        }),
      ),
    );
  }

  private static connectionsProvider(): Provider {
    return {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections,
    };
  }

  private static createAsyncProviders(
    options: PrismaModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<PrismaOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      { provide: useClass, useClass },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PrismaModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PRISMA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<PrismaOptionsFactory>,
    ];
    return {
      provide: PRISMA_MODULE_OPTIONS,
      inject,
      useFactory: (factory: PrismaOptionsFactory) =>
        factory.createPrismaModuleOptions(),
    };
  }
}
