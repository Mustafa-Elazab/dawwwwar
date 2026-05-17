import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCodeEntity } from '../../../database/entities/promo-code.entity';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../database/entities/user.entity';

@ApiTags('Admin / Promo')
@Controller('admin/promo')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminPromoController {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly promoRepo: Repository<PromoCodeEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all promo codes' })
  async findAll() {
    return {
      success: true,
      data: await this.promoRepo.find({
        order: { createdAt: 'DESC' },
      }),
    };
  }
}
