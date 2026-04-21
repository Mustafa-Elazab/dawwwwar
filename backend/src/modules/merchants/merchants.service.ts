import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import type { NearbyFilterDto } from './dto/nearby-filter.dto';

// Haversine distance in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly repo: Repository<MerchantEntity>,
  ) {}

  async findNearby(filter: NearbyFilterDto): Promise<MerchantEntity[]> {
    const { latitude = 30.8704, longitude = 31.4741, radius = 10, categoryId, filter: openFilter } = filter;

    const query = this.repo.createQueryBuilder('merchant')
      .where('merchant.isApproved = true');

    if (openFilter === 'open') {
      query.andWhere('merchant.isOpen = true');
    }

    if (categoryId) {
      query.andWhere('merchant.category = :categoryId', { categoryId });
    }

    const merchants = await query.getMany();

    // Filter by radius (Haversine — could use PostGIS in Phase 3)
    return merchants
      .filter((m) => haversine(latitude, longitude, Number(m.latitude), Number(m.longitude)) <= radius)
      .sort((a, b) =>
        haversine(latitude, longitude, Number(a.latitude), Number(a.longitude)) -
        haversine(latitude, longitude, Number(b.latitude), Number(b.longitude)),
      );
  }

  async findById(id: string): Promise<MerchantEntity> {
    const merchant = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async findByUserId(userId: string): Promise<MerchantEntity | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async toggleOpen(merchantId: string, isOpen: boolean): Promise<MerchantEntity> {
    await this.repo.update(merchantId, { isOpen, canReceiveOrders: isOpen });
    return this.findById(merchantId);
  }
}
