import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { OrderNotificationsService } from './order-notifications.service';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [NotificationsService, OrderNotificationsService],
  exports: [NotificationsService, OrderNotificationsService],
})
export class NotificationsModule {}
