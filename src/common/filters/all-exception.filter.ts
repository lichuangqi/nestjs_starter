import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const exceptionName =
      exception instanceof Error ? exception.name : 'UnknownException';

    const timestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(request);
    const logContext = {
      method: request.method,
      path,
      query: request.query,
      params: request.params,
      timestamp,
      ip: requestIp.getClientIp(request),
      statusCode: httpStatus,
      exception: exceptionName,
      error: msg,
    };

    this.logger.error(
      logContext,
      exception instanceof Error ? exception.stack : undefined,
    );

    const responseBody = {
      statusCode: httpStatus,
      timestamp,
      path,
      error: msg,
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
