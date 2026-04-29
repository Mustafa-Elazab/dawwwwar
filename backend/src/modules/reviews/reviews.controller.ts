import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';

@ApiTags('Reviews')
@ApiBearerAuth('access-token')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a review for a completed order' })
  create(@CurrentUser() user: UserEntity, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(user.id, dto);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get reviews for a merchant' })
  getMerchantReviews(@Param('merchantId') merchantId: string) {
    return this.reviewsService.getMerchantReviews(merchantId);
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get reviews for a driver' })
  getDriverReviews(@Param('driverId') driverId: string) {
    return this.reviewsService.getDriverReviews(driverId);
  }
}
