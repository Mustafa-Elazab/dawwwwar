import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCodeEntity, DiscountType } from '../../database/entities/promo-code.entity';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePromoDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  orderAmount: number;
}

export class CreatePromoCodeDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxUses?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  expiresAt?: Date;
}

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly repo: Repository<PromoCodeEntity>,
  ) {}

  async validatePromo(
    dto: ValidatePromoDto,
  ): Promise<{ valid: boolean; discountAmount: number; promoCode?: PromoCodeEntity; error?: string }> {
    const promo = await this.repo.findOne({
      where: { code: dto.code.toUpperCase().trim(), isActive: true },
    });

    if (!promo) {
      return { valid: false, discountAmount: 0, error: 'INVALID_PROMO_CODE' };
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return { valid: false, discountAmount: 0, error: 'PROMO_EXPIRED' };
    }

    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      return { valid: false, discountAmount: 0, error: 'PROMO_EXHAUSTED' };
    }

    if (Number(promo.minOrderAmount) > 0 && dto.orderAmount < Number(promo.minOrderAmount)) {
      return {
        valid: false,
        discountAmount: 0,
        error: `MIN_ORDER_${promo.minOrderAmount}`,
      };
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === DiscountType.PERCENT) {
      discountAmount = Math.min(
        (dto.orderAmount * Number(promo.discountValue)) / 100,
        dto.orderAmount,
      );
    } else {
      discountAmount = Math.min(Number(promo.discountValue), dto.orderAmount);
    }

    return { valid: true, discountAmount, promoCode: promo };
  }

  /** Increment used count — call when order is placed with this promo */
  async markUsed(code: string): Promise<void> {
    await this.repo.increment({ code: code.toUpperCase().trim() }, 'usedCount', 1);
  }

  async findAll(): Promise<PromoCodeEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreatePromoCodeDto): Promise<PromoCodeEntity> {
    const promo = this.repo.create({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      minOrderAmount: dto.minOrderAmount ?? 0,
      maxUses: dto.maxUses ?? 0,
      usedCount: 0,
      isActive: true,
    });
    return this.repo.save(promo);
  }

  async toggle(id: string, isActive: boolean): Promise<PromoCodeEntity> {
    const promo = await this.repo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promo code not found');
    await this.repo.update(id, { isActive });
    return this.repo.findOne({ where: { id } }) as Promise<PromoCodeEntity>;
  }
}
