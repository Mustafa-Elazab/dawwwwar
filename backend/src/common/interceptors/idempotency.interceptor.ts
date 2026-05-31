import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { IS_IDEMPOTENT_KEY } from '../decorators/idempotent.decorator';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(IS_IDEMPOTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isIdempotent) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      return next.handle();
    }

    // 1. Check if we have a cached response for this key
    const cacheKey = `idempotency:${idempotencyKey}`;
    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      // Return cached response instantly
      return of(cachedResponse);
    }

    // 2. Check if the request is already in progress to prevent near-simultaneous duplicates
    const processingKey = `idempotency_processing:${idempotencyKey}`;
    const isProcessing = await this.cacheManager.get(processingKey);

    if (isProcessing) {
      throw new ConflictException('Request with this idempotency key is already in progress');
    }

    // 3. Mark as processing (expire in 30s as a safety)
    await this.cacheManager.set(processingKey, true, 30000);

    return next.handle().pipe(
      tap(async (data) => {
        // 4. On success, cache the result for 24 hours
        await this.cacheManager.set(cacheKey, data, 24 * 60 * 60 * 1000);
      }),
      finalize(() => {
        void this.cacheManager.del(processingKey);
      }),
    );
  }
}
