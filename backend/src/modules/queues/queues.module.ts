import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './processors/notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  providers: [NotificationsProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
