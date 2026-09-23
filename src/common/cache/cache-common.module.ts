import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import Keyv from 'keyv';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisOn = configService.get<boolean>('REDIS_ON', false);
        const ttl = configService.get<number>('CACHE_TTL', 60_000);

        const store = redisOn
          ? createKeyv(
              configService.get<string>(
                'REDIS_URL',
                'redis://localhost:6379',
              ),
            )
          : new Keyv();

        return { ttl, stores: [store] };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheCommonModule {}
