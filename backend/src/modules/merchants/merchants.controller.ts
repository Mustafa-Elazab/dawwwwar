import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MerchantsService } from './merchants.service';
import { ProductsService } from '../products/products.service';
import { NearbyFilterDto } from './dto/nearby-filter.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserEntity, UserRole } from '../../database/entities/user.entity';

@ApiTags('Merchants')
@Controller('merchants')
@ApiBearerAuth('access-token')
export class MerchantsController {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby merchants, optionally filtered' })
  findNearby(@Query() filter: NearbyFilterDto) {
    return this.merchantsService.findNearby(filter);
  }

  @Get('my')
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get own merchant store' })
  async getMy(@CurrentUser() user: UserEntity) {
    const merchant = await this.merchantsService.findByUserId(user.id);
    // Return empty/404 if not found so frontend knows to show Create Store
    return merchant;
  }

  @Post()
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Create merchant store (merchant role only)' })
  create(@CurrentUser() user: UserEntity, @Body() dto: CreateMerchantDto) {
    return this.merchantsService.create(user.id, dto);
  }

  @Patch(':id')
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Update merchant store' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateMerchantDto,
  ) {
    return this.merchantsService.update(id, user.id, dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  findById(@Param('id') id: string) {
    return this.merchantsService.findById(id);
  }

  @Public()
  @Get(':id/products')
  @ApiOperation({ summary: 'Get products for a merchant' })
  findProducts(@Param('id') id: string) {
    return this.productsService.findByMerchant(id);
  }
}
