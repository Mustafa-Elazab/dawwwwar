import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoriteEntity } from '../../database/entities/favorite.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';
import { ProductEntity } from '../../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity, MerchantEntity, ProductEntity])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
