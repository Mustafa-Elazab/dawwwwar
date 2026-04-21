import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { CategoryEntity } from '../../database/entities/category.entity';

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

  async search(query: string): Promise<SearchResult> {
    if (!query.trim()) {
      return { merchants: [], products: [], categories: [], query };
    }

    const pattern = `%${query.trim()}%`;

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
