import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from '../../database/entities/product.entity';
import { MerchantsModule } from '../merchants/merchants.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), forwardRef(() => MerchantsModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
