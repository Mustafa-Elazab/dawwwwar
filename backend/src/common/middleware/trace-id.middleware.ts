import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Get trace ID from header or generate a new one
    const traceId = (req.headers['x-trace-id'] as string) || uuidv4();

    // 2. Attach to request object for use in interceptors/controllers
    (req as any).traceId = traceId;
    (req as any).idempotencyKey = req.headers['x-idempotency-key'];

    // 3. Set trace ID in response headers for client visibility
    res.setHeader('x-trace-id', traceId);
    if ((req as any).idempotencyKey) {
      res.setHeader('x-idempotency-key', (req as any).idempotencyKey);
    }

    next();
  }
}
