import { Module } from '@nestjs/common';
import { MailCommonModule } from './mail-common.module';

@Module({
  imports: [MailCommonModule],
  exports: [MailCommonModule],
})
export class MailModule {}
