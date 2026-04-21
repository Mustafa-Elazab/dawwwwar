import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { CategoryEntity } from '../../database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity, ProductEntity, CategoryEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
