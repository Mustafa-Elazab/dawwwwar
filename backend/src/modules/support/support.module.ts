import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './services/support.service';
import { TicketsController } from './tickets.controller';
import { AdminTicketsController } from './admin-tickets.controller';
import { 
  SupportTicketEntity, 
  TicketMessageEntity, 
  DisputeResolutionEntity,
  OrderEntity
} from '../../database/entities';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportTicketEntity, 
      TicketMessageEntity, 
      DisputeResolutionEntity,
      OrderEntity,
    ]),
    WalletModule,
  ],
  providers: [SupportService],
  controllers: [TicketsController, AdminTicketsController],
  exports: [SupportService],
})
export class SupportModule {}
