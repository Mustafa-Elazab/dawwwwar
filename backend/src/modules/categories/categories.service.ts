import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CategoryEntity } from '../../database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
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
}
