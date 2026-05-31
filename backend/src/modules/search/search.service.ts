import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { CategoryEntity } from '../../database/entities/category.entity';

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

export interface SearchResult {
  merchants: MerchantEntity[];
  products: ProductEntity[];
  categories: CategoryEntity[];
  query: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantRepo: Repository<MerchantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async search(query: string, lat?: number, lng?: number): Promise<SearchResult> {
    if (!query.trim()) {
      return { merchants: [], products: [], categories: [], query };
    }

    const pattern = `%${query.trim()}%`;

    if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
      const radius = CUSTOMER_MAX_RADIUS_KM;

      const [merchantMatches, productMatches, categoryMatches, allMerchants, allProducts] = await Promise.all([
        this.merchantRepo.find({
          where: [
            { businessName: ILike(pattern), isApproved: true },
            { address: ILike(pattern), isApproved: true },
          ],
          relations: ['categories'],
        }),
        this.productRepo.find({
          where: [
            { name: ILike(pattern), isAvailable: true },
            { nameAr: ILike(pattern), isAvailable: true },
          ],
          relations: ['merchant'],
        }),
        this.categoryRepo.find({
          where: [
            { name: ILike(pattern), isActive: true },
            { nameAr: ILike(pattern), isActive: true },
          ],
          take: 10,
        }),
        this.merchantRepo.find({
          where: { isApproved: true },
          relations: ['categories'],
        }),
        this.productRepo.find({
          where: { isAvailable: true },
          relations: ['merchant'],
        }),
      ]);

      const merchants = merchantMatches
        .filter((merchant) => distanceKm(lat, lng, merchant.latitude, merchant.longitude) <= radius)
        .slice(0, 10);

      const products = productMatches
        .filter((product) =>
          product.merchant?.isApproved &&
          distanceKm(lat, lng, product.merchant.latitude, product.merchant.longitude) <= radius,
        )
        .slice(0, 20);

      const nearbyCategoryIds = new Set<string>();
      allMerchants.forEach((merchant) => {
        if (distanceKm(lat, lng, merchant.latitude, merchant.longitude) <= radius) {
          if (merchant.parentCategoryId) nearbyCategoryIds.add(merchant.parentCategoryId);
          merchant.categories?.forEach((category) => nearbyCategoryIds.add(category.id));
        }
      });
      allProducts.forEach((product) => {
        if (
          product.merchant?.isApproved &&
          distanceKm(lat, lng, product.merchant.latitude, product.merchant.longitude) <= radius
        ) {
          nearbyCategoryIds.add(product.categoryId);
        }
      });

      const categories = categoryMatches
        .filter((category) => nearbyCategoryIds.has(category.id))
        .slice(0, 10);

      return { merchants, products, categories, query };
    }

    const [merchants, products, categories] = await Promise.all([
      this.merchantRepo.find({
        where: [
          { businessName: ILike(pattern), isApproved: true },
          { address: ILike(pattern), isApproved: true },
        ],
        take: 10,
      }),
      this.productRepo.find({
        where: [
          { name: ILike(pattern), isAvailable: true },
          { nameAr: ILike(pattern), isAvailable: true },
        ],
        take: 20,
      }),
      this.categoryRepo.find({
        where: [
          { name: ILike(pattern), isActive: true },
          { nameAr: ILike(pattern), isActive: true },
        ],
        take: 10,
      }),
    ]);

    return { merchants, products, categories, query };
  }
}
