import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { WalletTransactionEntity } from '../../database/entities/wallet-transaction.entity';
import { WalletRechargeEntity } from '../../database/entities/wallet-recharge.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    GatewayModule,
    TypeOrmModule.forFeature([
      WalletEntity,
      WalletTransactionEntity,
      WalletRechargeEntity,
      UserEntity,
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
