import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth('access-token')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get merchant analytics for today' })
  async getToday(@CurrentUser() user: UserEntity) {
    const data = await this.analyticsService.getMerchantToday(user.id);
    return { success: true, data };
  }
}
