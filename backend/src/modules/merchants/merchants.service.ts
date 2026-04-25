import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import type { NearbyFilterDto } from './dto/nearby-filter.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly repo: Repository<MerchantEntity>,
  ) {}

  async findNearby(filter: NearbyFilterDto): Promise<MerchantEntity[]> {
    const {
      latitude = 30.8704,
      longitude = 31.4741,
      radius = 10,          // km
      categoryId,
      filter: openFilter,
    } = filter;

    const radiusMetres = radius * 1000;

    // PostGIS ST_DWithin — uses spatial index, O(log n) instead of O(n)
    let query = this.repo
      .createQueryBuilder('merchant')
      .where('merchant.isApproved = true')
      .andWhere(
        `ST_DWithin(
          merchant.location,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lat: latitude, lng: longitude, radius: radiusMetres },
      )
      .orderBy(
        `ST_Distance(
          merchant.location,
          ST_SetSRID(ST_MakePoint(:lng2, :lat2), 4326)::geography
        )`,
        'ASC',
      )
      .setParameters({ lat2: latitude, lng2: longitude });

    if (openFilter === 'open') {
      query = query.andWhere('merchant.isOpen = true');
    }
    if (categoryId) {
      query = query.andWhere('merchant.category = :categoryId', { categoryId });
    }

    return query.getMany();
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
