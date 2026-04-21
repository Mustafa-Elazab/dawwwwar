import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { ProductsService } from '../products/products.service';
import { NearbyFilterDto } from './dto/nearby-filter.dto';

@ApiTags('Merchants')
@Controller('merchants')
@ApiBearerAuth('access-token')
export class MerchantsController {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly productsService: ProductsService,
  ) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby merchants, optionally filtered' })
  findNearby(@Query() filter: NearbyFilterDto) {
    return this.merchantsService.findNearby(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  findById(@Param('id') id: string) {
    return this.merchantsService.findById(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get products for a merchant' })
  findProducts(@Param('id') id: string) {
    return this.productsService.findByMerchant(id);
  }
}
