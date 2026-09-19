import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const cors = configService.get<boolean>('CORS', false);
  const prefix = configService.get<string>('PREFIX', 'api');
  const versionStr = configService.get<string>('VERSION');
  const versions = versionStr
    ?.split(',')
    .map((version) => version.trim())
    .filter(Boolean);
  const errorFilterEnabled = configService.get<boolean>('ERROR_FILTER', true);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:
      versions && versions.length > 0 ? versions : VERSION_NEUTRAL,
  });
  if (cors) {
    app.enableCors();
  }

  if (errorFilterEnabled) {
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));
  }

  await app.listen(port);
}
bootstrap();
