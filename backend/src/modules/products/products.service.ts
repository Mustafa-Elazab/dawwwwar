import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../database/entities/product.entity';
import { MerchantsService } from '../merchants/merchants.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

const CUSTOMER_MAX_RADIUS_KM = 10;

const toNumber = (value: number | string | null | undefined): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const distanceKm = (fromLat: number, fromLng: number, toLat: number | string, toLng: number | string): number => {
  const lat2 = toNumber(toLat);
  const lng2 = toNumber(toLng);
  if (lat2 == null || lng2 == null) return Number.POSITIVE_INFINITY;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - fromLat);
  const dLng = toRad(lng2 - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
    @Inject(forwardRef(() => MerchantsService))
    private readonly merchantsService: MerchantsService,
  ) {}

  async findByMerchant(merchantId?: string, userId?: string): Promise<ProductEntity[]> {
    let actualMerchantId = merchantId;
    if (!actualMerchantId && userId) {
      const merchant = await this.merchantsService.findByUserId(userId);
      if (merchant) {
        actualMerchantId = merchant.id;
      }
    }
    if (!actualMerchantId) {
      throw new NotFoundException('MERCHANT_NOT_FOUND');
    }
    return this.repo.find({
      where: { merchantId: actualMerchantId },
      order: { isFeatured: 'DESC', totalOrders: 'DESC', createdAt: 'ASC' },
    });
  }

  async findFeatured(lat?: number, lng?: number, radiusKm = CUSTOMER_MAX_RADIUS_KM): Promise<ProductEntity[]> {
    if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
      const radius = Math.min(Math.max(radiusKm, 1), CUSTOMER_MAX_RADIUS_KM);
      const products = await this.repo.find({
        where: { isFeatured: true, isAvailable: true },
        relations: ['merchant'],
        order: { totalOrders: 'DESC' },
      });
      return products
        .filter((product) =>
          product.merchant?.isApproved &&
          distanceKm(lat, lng, product.merchant.latitude, product.merchant.longitude) <= radius,
        )
        .slice(0, 20);
    }

    return this.repo.find({
      where: { isFeatured: true, isAvailable: true },
      order: { totalOrders: 'DESC' },
      take: 20,
    });
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('PRODUCT_NOT_FOUND');
    return product;
  }

  async create(
    userId: string,
    dto: CreateProductDto,
  ): Promise<ProductEntity> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');

    const product = this.repo.create({ ...dto, merchantId: merchant.id });
    return this.repo.save(product);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findById(id);
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant || product.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_UPDATE_PRODUCT');
    }
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async toggleAvailability(
    id: string,
    userId: string,
    isAvailable: boolean,
  ): Promise<ProductEntity> {
    return this.update(id, userId, { isAvailable });
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findById(id);
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant || product.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_DELETE_PRODUCT');
    }
    await this.repo.remove(product);
  }
}
