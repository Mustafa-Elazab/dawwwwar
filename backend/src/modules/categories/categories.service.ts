import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { CategoryEntity } from '../../database/entities/category.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';

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
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantRepo: Repository<MerchantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async findAll(lat?: number, lng?: number, radiusKm = CUSTOMER_MAX_RADIUS_KM): Promise<CategoryEntity[]> {
    if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
      try {
        const ids = await this.findNearbyCategoryIds(lat, lng, radiusKm);
        if (ids.length === 0) return [];
        return this.repo.find({
          where: { id: In(ids), isActive: true },
          order: { sortOrder: 'ASC' },
        });
      } catch (error) {
        this.logger.warn(
          `Failed to filter categories by location; falling back to active categories: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return this.repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getTree(): Promise<CategoryEntity[]> {
    return this.repo.find({
      where: { parentId: IsNull(), isActive: true },
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getParents(): Promise<CategoryEntity[]> {
    return this.repo.find({
      where: { parentId: IsNull(), isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getChildren(parentId: string): Promise<CategoryEntity[]> {
    return this.repo.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  private async findNearbyCategoryIds(lat: number, lng: number, radiusKm = CUSTOMER_MAX_RADIUS_KM): Promise<string[]> {
    const radius = Math.min(Math.max(Number.isFinite(radiusKm) ? radiusKm : CUSTOMER_MAX_RADIUS_KM, 1), CUSTOMER_MAX_RADIUS_KM);
    const ids = new Set<string>();

    const nearbyMerchants = (await this.merchantRepo.find({
      where: { isApproved: true },
      relations: ['categories'],
    })).filter((merchant) => distanceKm(lat, lng, merchant.latitude, merchant.longitude) <= radius);

    nearbyMerchants.forEach((merchant) => {
      if (merchant.parentCategoryId) ids.add(merchant.parentCategoryId);
      merchant.categories?.forEach((category) => ids.add(category.id));
    });

    const products = await this.productRepo.find({
      where: { isAvailable: true },
      relations: ['merchant'],
    });

    products.forEach((product) => {
      if (
        product.merchant?.isApproved &&
        distanceKm(lat, lng, product.merchant.latitude, product.merchant.longitude) <= radius
      ) {
        ids.add(product.categoryId);
      }
    });

    return [...ids];
  }
}
