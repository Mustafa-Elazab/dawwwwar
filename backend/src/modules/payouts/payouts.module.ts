import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { PaymobPayoutService } from './services/paymob-payout.service';
import { PayoutsProcessor } from './processors/payouts.processor';
import { 
  PayoutRequestEntity, 
  PayoutEventEntity, 
  OrderEntity 
} from '../../database/entities';
import { WalletModule } from '../wallet/wallet.module';

import { PaymobPayoutWebhooksController } from './controllers/paymob-payout-webhooks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayoutRequestEntity, 
      PayoutEventEntity, 
      OrderEntity
    ]),
    WalletModule,
    BullModule.registerQueue({
      name: 'payouts',
    }),
  ],
  providers: [
    PayoutsService, 
    PaymobPayoutService, 
    PayoutsProcessor
  ],
  controllers: [
    PayoutsController,
    PaymobPayoutWebhooksController
  ],
  exports: [PayoutsService],
})
export class PayoutsModule {}
