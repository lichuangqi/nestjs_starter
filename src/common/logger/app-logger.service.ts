import { Injectable, type LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, type Logger } from 'winston';
import createDailyRotateTransport, {
  consoleTransports,
} from './createRotateTransport';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(configService: ConfigService) {
    const logOn = configService.get<boolean>('LOG_ON', false);
    this.logger = createLogger({
      transports: [
        consoleTransports,
        ...(logOn
          ? [
              createDailyRotateTransport('info', 'application'),
              createDailyRotateTransport('warn', 'error'),
            ]
          : []),
      ],
    });
  }

  log(message: unknown, context?: string) {
    this.logger.info(this.serialize(message), { context });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error(this.serialize(message), { trace, context });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(this.serialize(message), { context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(this.serialize(message), { context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(this.serialize(message), { context });
  }

  fatal(message: unknown, context?: string) {
    this.logger.error(this.serialize(message), { context, fatal: true });
  }

  private serialize(message: unknown): string {
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.stack ?? message.message;

    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }
}
