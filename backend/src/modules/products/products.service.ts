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

  async findFeatured(): Promise<ProductEntity[]> {
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
