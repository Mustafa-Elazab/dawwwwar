import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewEntity } from '../../database/entities/review.entity';
import { OrderEntity } from '../../database/entities/order.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { DriverProfileEntity } from '../../database/entities/driver-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, OrderEntity, MerchantEntity, DriverProfileEntity]),
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
