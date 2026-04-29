import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { appConfig } from './config/app.config';
import { uploadConfig } from './config/upload.config';
import { firebaseConfig } from './config/firebase.config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { ProductsModule } from './modules/products/products.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { UploadModule } from './modules/upload/upload.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PromoModule } from './modules/promo/promo.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ChatModule } from './modules/chat/chat.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

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
  ReviewEntity,
  PromoCodeEntity,
  ChatMessageEntity,
  FavoriteEntity,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      load: [databaseConfig, jwtConfig, appConfig, uploadConfig, firebaseConfig],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60 seconds default
    }),
    ThrottlerModule.forRoot([{
      ttl: 600000, // 10 minutes
      limit: 3,
    }]),
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
          ReviewEntity,
          PromoCodeEntity,
          ChatMessageEntity,
          FavoriteEntity,
        ],
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
        extra: {
          // Required for PostGIS geography type in TypeORM
          nativeEnums: true,
        },
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    MerchantsModule,
    ProductsModule,
    SearchModule,
    OrdersModule,
    WalletModule,
    AddressesModule,
    DriversModule,
    GatewayModule,
    UploadModule,
    AnalyticsModule,
    ReviewsModule,
    PromoModule,
    FavoritesModule,
    ChatModule,
    SchedulerModule,
  ],
})
export class AppModule {}
