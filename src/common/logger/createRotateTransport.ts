import DailyRotateFile from 'winston-daily-rotate-file';
import { format } from 'winston';
import { Console } from 'winston/lib/winston/transports';

export const consoleTransports = new Console({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.ms(),
    format.colorize(),
    format.printf(({ level, message, context, timestamp, ms }) => {
      const scope = context ? ` [${String(context)}]` : '';
      const content =
        typeof message === 'string' ? message : JSON.stringify(message);
      return `${String(timestamp)} ${level}${scope} ${content} ${String(ms)}`;
    }),
  ),
});

export default function createDailyRotateTransport(
  level: string,
  fileName: string,
) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(format.timestamp(), format.simple()),
  });
}
