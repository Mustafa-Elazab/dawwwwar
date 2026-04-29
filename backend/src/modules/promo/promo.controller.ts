import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromoService, ValidatePromoDto, CreatePromoCodeDto } from './promo.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class TogglePromoDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

@ApiTags('Promo')
@ApiBearerAuth('access-token')
@Controller()
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  /**
   * POST /checkout/validate-promo
   * Public-ish: any authenticated user can validate a promo before placing an order
   */
  @Post('checkout/validate-promo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a promo code and get discount amount' })
  validate(@Body() dto: ValidatePromoDto) {
    return this.promoService.validatePromo(dto);
  }

  // ── Admin-only endpoints ──────────────────────────────────────────

  @Get('promo')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all promo codes (Admin only)' })
  findAll() {
    return this.promoService.findAll();
  }

  @Post('promo')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a promo code (Admin only)' })
  create(@Body() dto: CreatePromoCodeDto) {
    return this.promoService.create(dto);
  }

  @Patch('promo/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle promo code active status (Admin only)' })
  toggle(@Param('id') id: string, @Body() dto: TogglePromoDto) {
    return this.promoService.toggle(id, dto.isActive);
  }
}
