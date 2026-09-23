import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TYPEORM_CONNECTIONS } from './database/typeorm/typeorm.constants';

export class AppService implements OnApplicationShutdown {
  constructor(
    @Inject(TYPEORM_CONNECTIONS)
    private connections: Map<string, DataSource>,
  ) {}

  async onApplicationShutdown() {
    await Promise.all(
      [...this.connections.values()].map((connection) =>
        connection.isInitialized ? connection.destroy() : Promise.resolve(),
      ),
    );
  }
}
