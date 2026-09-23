import { DynamicModule, Module } from '@nestjs/common';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
} from './prisma-options.interface';
import { PrismaCoreModule } from './prisma-core.module';

@Module({})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions): DynamicModule;
  static forRoot(url: string): DynamicModule;
  static forRoot(url: string, name: string): DynamicModule;
  static forRoot(arg: any, ...args: string[]): DynamicModule {
    let _options: PrismaModuleOptions;

    if (args && args.length) {
      _options = { url: arg, name: args[0] };
    } // TODO
    else if (typeof arg === 'string') {
      _options = { url: arg };
    } else {
      _options = arg;
    }

    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRoot(_options)],
    };
  }

  static forRootAsync(options: PrismaModuleAsyncOptions) {
    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRootAsync(options)],
    };
  }
}
