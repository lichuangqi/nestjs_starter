import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose.module';
import { MongooseConfigService } from './mongoose-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class MongooseCommonModule {}
