import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const cacheManager = app.get<Cache>(CACHE_MANAGER);
  const logger = new Logger('Bootstrap');
  const appConfig = configService.get('app');

  // Security hardening
  app.use(helmet());
  app.enableShutdownHooks();
  if (appConfig?.trustProxy) {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    if (instance?.set) instance.set('trust proxy', 1);
  }

  // API prefix
  app.setGlobalPrefix(appConfig?.apiPrefix ?? 'api');

  // Serve local uploads
  if (process.env.NODE_ENV !== 'production') {
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  }

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Body limits
  app.use(express.json({ limit: appConfig?.bodyLimit ?? '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: appConfig?.bodyLimit ?? '2mb' }));

  // Request timeouts
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timeoutMs = appConfig?.requestTimeoutMs ?? 30000;
    req.setTimeout(timeoutMs);
    res.setTimeout(timeoutMs);
    next();
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new LoggingInterceptor(),
    new IdempotencyInterceptor(cacheManager, reflector),
  );

  // Global JWT guard (with @Public() support)
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dawwar API')
    .setDescription('Hyperlocal delivery platform API')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // CORS
  const corsOrigins = appConfig?.corsOrigins ?? ['*'];
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = appConfig?.port ?? 3000;
  const host = appConfig?.host ?? '0.0.0.0';
  await app.listen(port, host);

  logger.log(`API listening on http://${host}:${port}/${appConfig?.apiPrefix ?? 'api'}`);

  // console.log(`Server running on http://localhost:${port}/${apiPrefix}`);
  // console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
