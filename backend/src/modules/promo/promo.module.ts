import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { PromoCodeEntity } from '../../database/entities/promo-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCodeEntity])],
  providers: [PromoService],
  controllers: [PromoController],
  exports: [PromoService],
})
export class PromoModule {}
