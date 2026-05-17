import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { resolveLanguage, getLocalizedMessage, ERROR_MESSAGES } from '../i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const lang = resolveLanguage(request.headers['accept-language'] as string);

    // Extract the raw message from NestJS exception
    let rawMessage: string | string[] = '';
    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        rawMessage = exceptionResponse;
      } else {
        const obj = exceptionResponse as Record<string, unknown>;
        rawMessage = (obj.message as string | string[]) ?? '';
      }
    } else {
      rawMessage = exception.message || 'Internal server error';
    }

    // If rawMessage is an array (validation errors), join them
    const messageStr = Array.isArray(rawMessage) ? rawMessage.join('; ') : rawMessage;

    // Determine errorCode: check if the message itself is a known code,
    // or extract from patterns like "INVALID_OTP:3"
    const baseCode = messageStr.split(':')[0]?.trim() ?? '';
    const isKnownCode = !!ERROR_MESSAGES[baseCode];

    const errorCode = isKnownCode ? baseCode : this.inferCode(status, messageStr);

    // If it's a validation error, we want to show the detailed message
    const isValidationError = status === 400 && !isKnownCode;

    const localizedMessage = isKnownCode
      ? getLocalizedMessage(baseCode, lang)
      : isValidationError
      ? messageStr
      : getLocalizedMessage(errorCode, lang);

    // For INVALID_OTP:N — append remaining attempts
    let extra: Record<string, unknown> | undefined;
    if (baseCode === 'INVALID_OTP' && messageStr.includes(':')) {
      const remaining = messageStr.split(':')[1];
      extra = { remainingAttempts: parseInt(remaining ?? '0', 10) };
    }

    // Log the error for backend debugging
    if (status >= 400) {
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status} - Error: ${errorCode} - Message: ${messageStr}`,
      );
      if (status >= 500) {
        this.logger.error(exception.stack);
      }
    }

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        errorCode,
        message: localizedMessage,
        ...(extra ?? {}),
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /** Best-effort: map a generic HTTP status + message to a known error code */
  private inferCode(status: number, message: string): string {
    if (status === 401) return 'ACCESS_TOKEN_REQUIRED';
    if (status === 403) return 'ACCESS_DENIED';
    if (status === 404) return 'NOT_FOUND';
    if (status === 400) return 'VALIDATION_ERROR';

    // Return the message as-is if it looks like a code (UPPER_SNAKE_CASE)
    if (/^[A-Z][A-Z0-9_]+$/.test(message)) return message;

    return 'GENERIC_ERROR';
  }
}


