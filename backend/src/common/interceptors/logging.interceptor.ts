import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Telescope');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const traceId = (request as any).traceId || 'no-trace-id';
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const delay = Date.now() - now;
        this.logRequest(method, url, delay, response.statusCode, headers, body, data, traceId);
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logRequest(
          method,
          url,
          delay,
          error.status || 500,
          headers,
          body,
          error.response || error.message,
          traceId,
          true,
        );
        return throwError(() => error);
      }),
    );
  }

  private logRequest(
    method: string,
    url: string,
    delay: number,
    status: number,
    headers: any,
    reqBody: any,
    resBody: any,
    traceId: string,
    isError = false,
  ) {
    const logMethod = isError ? 'error' : 'log';
    
    const message = `${method} ${url} ${status} +${delay}ms [ID: ${traceId.slice(0, 8)}]${headers['x-idempotency-key'] ? ` [IDEM: ${headers['x-idempotency-key'].slice(0, 8)}]` : ''}`;
    this.logger[logMethod](`──────────────────────────────────────────────────`);
    this.logger[logMethod](message);
    
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`[Trace ID]: ${traceId}`);
      this.logger.debug(`[Headers]: ${JSON.stringify(headers, null, 2)}`);
      if (reqBody && Object.keys(reqBody).length > 0) {
        this.logger.debug(`[Request Body]: ${JSON.stringify(reqBody, null, 2)}`);
      }
      if (resBody) {
        this.logger.debug(`[Response Body]: ${JSON.stringify(resBody, null, 2)}`);
      }
    }
    this.logger[logMethod](`──────────────────────────────────────────────────`);
  }
}
