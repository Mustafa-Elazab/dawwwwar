import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth('access-token')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products for home screen' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get()
  @ApiOperation({ summary: 'Get products by merchantId' })
  @ApiQuery({ name: 'merchantId', required: true })
  findByMerchant(@Query('merchantId') merchantId: string) {
    return this.productsService.findByMerchant(merchantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product (merchant only)' })
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product (merchant only)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (merchant only)' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.productsService.remove(id, user.id);
  }
}
