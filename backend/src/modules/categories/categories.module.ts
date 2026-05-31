import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from '../../database/entities/category.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, MerchantEntity, ProductEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
