import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { UserRole } from '../../database/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth('access-token')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ─── Merchant Analytics ───────────────────────────────────────────

  @Get('merchant/today')
  @ApiOperation({ summary: 'Get merchant analytics for today' })
  async getMerchantToday(@CurrentUser() user: UserEntity) {
    const data = await this.analyticsService.getMerchantToday(user.id);
    return { success: true, data };
  }

  @Get('merchant/range')
  @ApiOperation({ summary: 'Get merchant analytics for date range' })
  @ApiQuery({ name: 'startDate', type: String, required: true })
  @ApiQuery({ name: 'endDate', type: String, required: true })
  async getMerchantRange(
    @CurrentUser() user: UserEntity,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.analyticsService.getMerchantAnalyticsForRange(user.id, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    return { success: true, data };
  }

  // ─── Driver Analytics ─────────────────────────────────────────────

  @Get('driver/today')
  @ApiOperation({ summary: 'Get driver analytics for today' })
  async getDriverToday(@CurrentUser() user: UserEntity) {
    const data = await this.analyticsService.getDriverToday(user.id);
    return { success: true, data };
  }

  @Get('driver/range')
  @ApiOperation({ summary: 'Get driver analytics for date range' })
  @ApiQuery({ name: 'startDate', type: String, required: true })
  @ApiQuery({ name: 'endDate', type: String, required: true })
  async getDriverRange(
    @CurrentUser() user: UserEntity,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.analyticsService.getDriverAnalyticsForRange(user.id, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    return { success: true, data };
  }

  // ─── Customer Analytics ───────────────────────────────────────────

  @Get('customer/me')
  @ApiOperation({ summary: 'Get customer analytics for current user' })
  async getCustomerAnalytics(@CurrentUser() user: UserEntity) {
    const data = await this.analyticsService.getCustomerAnalytics(user.id);
    return { success: true, data };
  }

  // ─── Admin / Platform Analytics ───────────────────────────────────

  @Get('platform')
  @ApiOperation({ summary: 'Get platform-wide analytics (Admin only)' })
  @Roles(UserRole.ADMIN)
  @ApiQuery({ name: 'startDate', type: String, required: true })
  @ApiQuery({ name: 'endDate', type: String, required: true })
  async getPlatformAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.analyticsService.getPlatformAnalytics({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    return { success: true, data };
  }
}
