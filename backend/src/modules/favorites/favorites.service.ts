import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../../database/entities/favorite.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repo: Repository<FavoriteEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantRepo: Repository<MerchantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async findAll(userId: string): Promise<FavoriteEntity[]> {
    return this.repo.find({
      where: { userId },
      relations: ['merchant'],
      order: { createdAt: 'DESC' },
    }).then((items) => items.filter((item) => item.merchantId && item.merchant));
  }

  async findProducts(userId: string): Promise<FavoriteEntity[]> {
    return this.repo.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    }).then((items) => items.filter((item) => item.productId && item.product));
  }

  async addProduct(userId: string, productId: string): Promise<FavoriteEntity> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('PRODUCT_NOT_FOUND');

    const existing = await this.repo.findOne({ where: { userId, productId } });
    if (existing) return existing;

    const fav = this.repo.create({ userId, productId });
    return this.repo.save(fav);
  }

  async removeProduct(userId: string, productId: string): Promise<void> {
    const fav = await this.repo.findOne({ where: { userId, productId } });
    if (!fav) throw new NotFoundException('FAVORITE_NOT_FOUND');
    if (fav.userId !== userId) throw new ForbiddenException();
    await this.repo.remove(fav);
  }

  async isProductFavorite(userId: string, productId: string): Promise<boolean> {
    const fav = await this.repo.findOne({ where: { userId, productId } });
    return !!fav;
  }

  async add(userId: string, merchantId: string): Promise<FavoriteEntity> {
    const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('MERCHANT_NOT_FOUND');

    const existing = await this.repo.findOne({ where: { userId, merchantId } });
    if (existing) throw new ConflictException('ALREADY_IN_FAVORITES');

    const fav = this.repo.create({ userId, merchantId });
    return this.repo.save(fav);
  }

  async remove(userId: string, merchantId: string): Promise<void> {
    const fav = await this.repo.findOne({ where: { userId, merchantId } });
    if (!fav) throw new NotFoundException('FAVORITE_NOT_FOUND');
    if (fav.userId !== userId) throw new ForbiddenException();
    await this.repo.remove(fav);
  }

  async isFavorite(userId: string, merchantId: string): Promise<boolean> {
    const fav = await this.repo.findOne({ where: { userId, merchantId } });
    return !!fav;
  }
}
