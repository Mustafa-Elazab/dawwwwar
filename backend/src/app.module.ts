import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { appConfig } from './config/app.config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Import all entities
import {
  UserEntity,
  MerchantEntity,
  CategoryEntity,
  ProductEntity,
  DriverProfileEntity,
  OrderEntity,
  OrderItemEntity,
  WalletEntity,
  WalletTransactionEntity,
  AddressEntity,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      load: [databaseConfig, jwtConfig, appConfig],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60 seconds default
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [
          UserEntity,
          MerchantEntity,
          CategoryEntity,
          ProductEntity,
          DriverProfileEntity,
          OrderEntity,
          OrderItemEntity,
          WalletEntity,
          WalletTransactionEntity,
          AddressEntity,
        ],
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
