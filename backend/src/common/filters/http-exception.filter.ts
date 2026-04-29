import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { resolveLanguage, getLocalizedMessage, ERROR_MESSAGES } from '../i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const lang = resolveLanguage(request.headers['accept-language'] as string);

    // Extract the raw message from NestJS exception
    let rawMessage: string | string[] = '';
    if (typeof exceptionResponse === 'string') {
      rawMessage = exceptionResponse;
    } else {
      const obj = exceptionResponse as Record<string, unknown>;
      rawMessage = (obj.message as string | string[]) ?? '';
    }

    // If rawMessage is an array (validation errors), join them
    const messageStr = Array.isArray(rawMessage) ? rawMessage.join('; ') : rawMessage;

    // Determine errorCode: check if the message itself is a known code,
    // or extract from patterns like "INVALID_OTP:3"
    const baseCode = messageStr.split(':')[0]?.trim() ?? '';
    const isKnownCode = !!ERROR_MESSAGES[baseCode];

    const errorCode = isKnownCode ? baseCode : this.inferCode(status, messageStr);
    const localizedMessage = isKnownCode
      ? getLocalizedMessage(baseCode, lang)
      : getLocalizedMessage(errorCode, lang);

    // For INVALID_OTP:N — append remaining attempts
    let extra: Record<string, unknown> | undefined;
    if (baseCode === 'INVALID_OTP' && messageStr.includes(':')) {
      const remaining = messageStr.split(':')[1];
      extra = { remainingAttempts: parseInt(remaining ?? '0', 10) };
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
    if (status === 404) return 'GENERIC_ERROR';
    // Return the message as-is if it looks like a code (UPPER_SNAKE_CASE)
    if (/^[A-Z][A-Z0-9_]+$/.test(message)) return message;
    return 'GENERIC_ERROR';
  }
}
