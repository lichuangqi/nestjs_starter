import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.get<string>('REDIS_TYPE', 'single');
        const password = configService.get<string>('REDIS_PASSWORD', '');
        if (type === 'cluster') {
          const hosts = configService
            .get<string>('REDIS_CLUSTER_HOST', '127.0.0.1')
            .split(',');
          const ports = configService
            .get<string>('REDIS_CLUSTER_PORT', '6379')
            .split(',')
            .map((port) => Number.parseInt(port, 10));
          return new Redis.Cluster(
            hosts.map((host, index) => ({
              host,
              port: ports[index] || 6379,
            })),
            { redisOptions: password ? { password } : undefined },
          );
        }

        return new Redis(
          configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
          password ? { password } : {},
        );
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisCommonModule {}
