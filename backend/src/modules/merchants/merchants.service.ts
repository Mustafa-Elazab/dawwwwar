import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { CategoryEntity } from '../../database/entities/category.entity';
import type { NearbyFilterDto } from './dto/nearby-filter.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

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
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly repo: Repository<MerchantEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findNearby(filter: NearbyFilterDto): Promise<MerchantEntity[]> {
    const {
      latitude: latInput,
      longitude: lngInput,
      lat: latAlias,
      lng: lngAlias,
      radius: radiusInput,
      radiusKm,
      categoryId,
      search,
      filter: openFilter,
      limit = 20,
      offset = 0,
    } = filter;

    const requestedRadius = radiusKm ?? radiusInput ?? CUSTOMER_MAX_RADIUS_KM;
    const radius = Math.min(Math.max(requestedRadius, 1), CUSTOMER_MAX_RADIUS_KM);

    const lat = latInput ?? latAlias;
    const lng = lngInput ?? lngAlias;
    const parsedLat = toNumber(lat);
    const parsedLng = toNumber(lng);

    if (parsedLat == null || parsedLng == null) {
      return [];
    }

    const merchants = await this.repo.find({
      where: { isApproved: true },
      relations: ['categories'],
    });

    let filtered = merchants
      .map((merchant) => ({
        merchant,
        distance: distanceKm(parsedLat, parsedLng, merchant.latitude, merchant.longitude),
      }))
      .filter((entry) => entry.distance <= radius);

    if (openFilter === 'open') {
      filtered = filtered.filter(({ merchant }) => merchant.isOpen);
    }

    if (categoryId) {
      const productMerchants = await this.repo.query(
        `
          SELECT DISTINCT merchant_id
          FROM products
          WHERE category_id = $1
            AND is_available = true
        `,
        [categoryId],
      );
      const merchantIdsWithProducts = new Set(
        productMerchants.map((row: { merchant_id: string }) => row.merchant_id),
      );
      filtered = filtered.filter(({ merchant }) =>
        merchant.parentCategoryId === categoryId ||
        merchant.categories?.some((category) => category.id === categoryId) ||
        merchantIdsWithProducts.has(merchant.id),
      );
    }

    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      filtered = filtered.filter(({ merchant }) =>
        merchant.businessName.toLowerCase().includes(normalizedSearch),
      );
    }

    return filtered
      .sort((a, b) => a.distance - b.distance)
      .slice(offset, offset + limit)
      .map(({ merchant }) => merchant);
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

    const { categoryIds, ...rest } = dto;

    const merchant = this.repo.create({
      ...rest,
      userId,
      isOpen: false,
      isApproved: true, 
      canReceiveOrders: false,
      rating: 0,
      totalRatings: 0,
    });

    if (categoryIds && categoryIds.length > 0) {
      merchant.categories = await this.categoryRepo.find({
        where: { id: In(categoryIds) },
      });
    }

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
