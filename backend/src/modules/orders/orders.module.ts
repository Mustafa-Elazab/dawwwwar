import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderNumberService } from './order-number.service';
import { OrderEntity } from '../../database/entities/order.entity';
import { OrderItemEntity } from '../../database/entities/order-item.entity';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { WalletTransactionEntity } from '../../database/entities/wallet-transaction.entity';
import { DriverProfileEntity } from '../../database/entities/driver-profile.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { MerchantsModule } from '../merchants/merchants.module';
import { GatewayModule } from '../gateway/gateway.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DriversModule } from '../drivers/drivers.module';
import { PromoModule } from '../promo/promo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      WalletEntity,
      WalletTransactionEntity,
      DriverProfileEntity,
      ProductEntity,
    ]),
    MerchantsModule,
    GatewayModule,
    NotificationsModule,
    DriversModule,
    PromoModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderNumberService],
  exports: [OrdersService],
})
export class OrdersModule {}
