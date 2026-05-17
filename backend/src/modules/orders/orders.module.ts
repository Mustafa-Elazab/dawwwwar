import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderNumberService } from './order-number.service';
import { DeliveryFeeService } from './delivery-fee.service';
import {
  OrderEntity,
  OrderEventEntity,
  OrderItemEntity,
  WalletEntity,
  WalletTransactionEntity,
  DriverProfileEntity,
  ProductEntity,
} from '../../database/entities';
import { MerchantsModule } from '../merchants/merchants.module';
import { GatewayModule } from '../gateway/gateway.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DriversModule } from '../drivers/drivers.module';
import { PromoModule } from '../promo/promo.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderEventEntity,
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
    WalletModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderNumberService, DeliveryFeeService],
  exports: [OrdersService],
})
export class OrdersModule {}
