import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReviewEntity } from '../../database/entities/review.entity';
import { OrderEntity, OrderStatus } from '../../database/entities/order.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { DriverProfileEntity } from '../../database/entities/driver-profile.entity';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantRepo: Repository<MerchantEntity>,
    @InjectRepository(DriverProfileEntity)
    private readonly driverRepo: Repository<DriverProfileEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createReview(customerId: string, dto: CreateReviewDto): Promise<ReviewEntity> {
    // Order must exist and belong to this customer
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');
    if (order.customerId !== customerId) throw new ForbiddenException('NOT_YOUR_ORDER');
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('CAN_ONLY_REVIEW_COMPLETED');
    }

    // One review per order
    const existing = await this.reviewRepo.findOne({ where: { orderId: dto.orderId } });
    if (existing) throw new ConflictException('ALREADY_REVIEWED');

    const review = this.reviewRepo.create({
      orderId: dto.orderId,
      customerId,
      merchantId: order.merchantId ?? null,
      driverId: order.driverId ?? null,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });

    const saved = await this.reviewRepo.save(review);

    // Recalculate merchant rating
    if (order.merchantId) {
      await this.recalculateMerchantRating(order.merchantId);
    }

    // Recalculate driver rating
    if (order.driverId) {
      await this.recalculateDriverRating(order.driverId);
    }

    return saved;
  }

  async getMerchantReviews(merchantId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.find({
      where: { merchantId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getDriverReviews(driverId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  // ── Private helpers ───────────────────────────────────────────────

  private async recalculateMerchantRating(merchantId: string): Promise<void> {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.merchantId = :merchantId', { merchantId })
      .getRawOne<{ avg: string; count: string }>();

    const avg = parseFloat(result?.avg ?? '0');
    const count = parseInt(result?.count ?? '0', 10);

    await this.merchantRepo.update(merchantId, {
      rating: Math.round(avg * 10) / 10,
      totalRatings: count,
    });
  }

  private async recalculateDriverRating(driverId: string): Promise<void> {
    // driverId on order is userId — look up profile
    const driver = await this.driverRepo.findOne({ where: { userId: driverId } });
    if (!driver) return;

    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.driverId = :driverId', { driverId })
      .getRawOne<{ avg: string; count: string }>();

    const avg = parseFloat(result?.avg ?? '0');
    const count = parseInt(result?.count ?? '0', 10);

    await this.driverRepo.update(driver.id, {
      rating: Math.round(avg * 10) / 10,
      totalRatings: count,
    });
  }
}
