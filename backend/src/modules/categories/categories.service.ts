import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CategoryEntity } from '../../database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    const cacheKey = 'categories:all';
    const cached = await this.cache.get<CategoryEntity[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    await this.cache.set(cacheKey, categories, 10 * 60 * 1000); // 10 min
    return categories;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({ where: { id } });
  }
}
