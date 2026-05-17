import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import type { NearbyFilterDto } from './dto/nearby-filter.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly repo: Repository<MerchantEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findNearby(filter: NearbyFilterDto): Promise<MerchantEntity[]> {
    const {
      latitude: latInput,
      longitude: lngInput,
      radius: radiusInput,
      radiusKm,
      categoryId,
      search,
      allEgypt,
      filter: openFilter,
      limit = 20,
      offset = 0,
    } = filter;

    const radius = radiusKm ?? radiusInput ?? 50;

    let query = this.repo
      .createQueryBuilder('merchant')
      .where('merchant.isApproved = true');

    if (allEgypt) {
      // All Egypt mode — sort by city, then name
      query = query.orderBy('merchant.city', 'ASC').addOrderBy('merchant.businessName', 'ASC');
    } else if (latInput != null && lngInput != null) {
      const radiusMetres = radius * 1000;
      // PostGIS ST_DWithin — uses spatial index
      query = query
        .andWhere(
          `ST_DWithin(
            merchant.location,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius
          )`,
          { lat: latInput, lng: lngInput, radius: radiusMetres },
        )
        .orderBy(
          `ST_Distance(
            merchant.location,
            ST_SetSRID(ST_MakePoint(:lng2, :lat2), 4326)::geography
          )`,
          'ASC',
        )
        .setParameters({ lat2: latInput, lng2: lngInput });
    } else {
      // No coordinates provided and not allEgypt — default to allEgypt sorting or throw error
      // Let's default to allEgypt sorting to avoid blank results
      query = query.orderBy('merchant.city', 'ASC').addOrderBy('merchant.businessName', 'ASC');
    }

    if (openFilter === 'open') {
      query = query.andWhere('merchant.isOpen = true');
    }
    
    if (categoryId) {
      query = query.andWhere('merchant.category = :categoryId', { categoryId });
    }

    if (search) {
      query = query.andWhere('LOWER(merchant.businessName) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    return query.take(limit).skip(offset).getMany();
  }

  async findById(id: string): Promise<MerchantEntity> {
    const merchant = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!merchant) throw new NotFoundException('MERCHANT_NOT_FOUND');
    return merchant;
  }

  async findByUserId(userId: string): Promise<MerchantEntity | null> {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  async create(userId: string, dto: CreateMerchantDto): Promise<MerchantEntity> {
    const existing = await this.findByUserId(userId);
    if (existing) throw new ConflictException('MERCHANT_ALREADY_EXISTS');

    const merchant = this.repo.create({
      ...dto,
      userId,
      isOpen: false,
      isApproved: true, 
      canReceiveOrders: false,
      rating: 0,
      totalRatings: 0,
    });

    const saved = await this.repo.save(merchant);
    
    // Update PostGIS location
    await this.repo.query(
      `UPDATE merchants SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
      [dto.longitude, dto.latitude, saved.id],
    );

    return this.findById(saved.id);
  }

  async update(id: string, userId: string, dto: UpdateMerchantDto): Promise<MerchantEntity> {
    const merchant = await this.findById(id);
    if (merchant.userId !== userId) throw new NotFoundException('MERCHANT_NOT_FOUND');

    await this.repo.update(id, dto);

    if (dto.latitude !== undefined || dto.longitude !== undefined) {
      const lat = dto.latitude ?? merchant.latitude;
      const lng = dto.longitude ?? merchant.longitude;
      await this.repo.query(
        `UPDATE merchants SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
        [lng, lat, id],
      );
    }

    return this.findById(id);
  }

  async toggleOpen(merchantId: string, isOpen: boolean): Promise<MerchantEntity> {
    await this.repo.update(merchantId, { isOpen, canReceiveOrders: isOpen });
    return this.findById(merchantId);
  }

  async findAllForAdmin(status?: string): Promise<MerchantEntity[]> {
    const query = this.repo.createQueryBuilder('merchant').leftJoinAndSelect('merchant.user', 'user');

    if (status === 'pending') {
      query.where('merchant.isApproved = false');
    } else if (status === 'approved') {
      query.where('merchant.isApproved = true');
    }

    return query.orderBy('merchant.createdAt', 'DESC').getMany();
  }

  async setApprovalStatus(id: string, isApproved: boolean): Promise<MerchantEntity> {
    await this.repo.update(id, { isApproved });
    return this.findById(id);
  }
}
