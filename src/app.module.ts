import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { DatabaseModule } from './database/database.module';
import { CacheCommonModule } from './common/cache/cache-common.module';
import { UserModule } from './user/user.module';
import { MailModule } from './common/mail/mail.module';
import { getEnvs } from './utils/get-envs';
import { toBoolean } from './utils/format';

const conditionalImports = () => {
  const parsedConfig = getEnvs();
  return toBoolean(parsedConfig['MAIL_ON']) ? [MailModule] : [];
};

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    DatabaseModule,
    CacheCommonModule,
    UserModule,
    ...conditionalImports(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
