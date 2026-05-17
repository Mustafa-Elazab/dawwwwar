import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminMerchantsController } from './controllers/admin-merchants.controller';
import { AdminOrdersController } from './controllers/admin-orders.controller';
import { AdminDriversController } from './controllers/admin-drivers.controller';
import { AdminPayoutsController } from './controllers/admin-payouts.controller';
import { AdminCustomersController } from './controllers/admin-customers.controller';
import { AdminPromoController } from './controllers/admin-promo.controller';
import { AdminAuditLogEntity } from '../../database/entities/admin-audit-log.entity';
import { UserEntity, PromoCodeEntity } from '../../database/entities';
import { MerchantsModule } from '../merchants/merchants.module';
import { OrdersModule } from '../orders/orders.module';
import { DriversModule } from '../drivers/drivers.module';
import { PayoutsModule } from '../payouts/payouts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminAuditLogEntity, UserEntity, PromoCodeEntity]),
    MerchantsModule,
    OrdersModule,
    DriversModule,
    PayoutsModule,
  ],
  providers: [AdminService],
  controllers: [
    AdminMerchantsController,
    AdminOrdersController,
    AdminDriversController,
    AdminPayoutsController,
    AdminCustomersController,
    AdminPromoController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
