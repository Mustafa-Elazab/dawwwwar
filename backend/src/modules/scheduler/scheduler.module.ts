import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerService } from './scheduler.service';
import { OrderEntity } from '../../database/entities/order.entity';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([OrderEntity]),
    GatewayModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
