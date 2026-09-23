import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './typeorm-config.service';
import { TYPEORM_DATABASE } from '../databse.constants';
import { TypeormProvider } from './typeorm.provider';
import { TYPEORM_CONNECTIONS } from './typeorm.constants';

const connections = new Map<string, DataSource>();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: TYPEORM_DATABASE,
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('TypeORM options are required');
        // tenantId
        const tenantId =
          (options as typeof options & { tenantId?: string }).tenantId ||
          'default';
        const existingConnection = connections.get(tenantId);
        if (existingConnection) return existingConnection;
        const dataSource = await new DataSource(options).initialize();
        connections.set(tenantId, dataSource);
        return dataSource;
      },
      inject: [],
      extraProviders: [],
    }),
  ],
  providers: [
    TypeormProvider,
    {
      provide: TYPEORM_CONNECTIONS,
      useValue: connections,
    },
  ],
})
export class TypeormCommonModule {}
