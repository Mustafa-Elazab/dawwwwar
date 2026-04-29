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

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repo: Repository<FavoriteEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantRepo: Repository<MerchantEntity>,
  ) {}

  async findAll(userId: string): Promise<FavoriteEntity[]> {
    return this.repo.find({
      where: { userId },
      relations: ['merchant'],
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: string, merchantId: string): Promise<FavoriteEntity> {
    const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const existing = await this.repo.findOne({ where: { userId, merchantId } });
    if (existing) throw new ConflictException('Already in favorites');

    const fav = this.repo.create({ userId, merchantId });
    return this.repo.save(fav);
  }

  async remove(userId: string, merchantId: string): Promise<void> {
    const fav = await this.repo.findOne({ where: { userId, merchantId } });
    if (!fav) throw new NotFoundException('Favorite not found');
    if (fav.userId !== userId) throw new ForbiddenException();
    await this.repo.remove(fav);
  }

  async isFavorite(userId: string, merchantId: string): Promise<boolean> {
    const fav = await this.repo.findOne({ where: { userId, merchantId } });
    return !!fav;
  }
}
