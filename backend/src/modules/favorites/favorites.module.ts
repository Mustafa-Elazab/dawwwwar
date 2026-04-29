import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoriteEntity } from '../../database/entities/favorite.entity';
import { MerchantEntity } from '../../database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity, MerchantEntity])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
