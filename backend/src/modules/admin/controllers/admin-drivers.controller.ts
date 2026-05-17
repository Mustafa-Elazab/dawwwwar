import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from '../admin.service';
import { DriversService } from '../../drivers/drivers.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { AdminAction } from '../../../database/entities/admin-audit-log.entity';

@ApiTags('Admin / Drivers')
@Controller('admin/drivers')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminDriversController {
  constructor(
    private readonly adminService: AdminService,
    private readonly driversService: DriversService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all drivers for admin fleet monitor' })
  findAll(@Query('status') status?: string) {
    return this.driversService.findAllForAdmin(status);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a driver application' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const driver = await this.driversService.setApprovalStatus(id, true);
    await this.adminService.logAction(
      admin.id,
      AdminAction.DRIVER_APPROVE,
      'driver',
      id,
      {},
      req.ip,
    );
    return driver;
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a driver application' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const driver = await this.driversService.setApprovalStatus(id, false);
    await this.adminService.logAction(
      admin.id,
      AdminAction.DRIVER_REJECT,
      'driver',
      id,
      { reason },
      req.ip,
    );
    return driver;
  }

  @Patch(':id/offline')
  @ApiOperation({ summary: 'Force a driver offline (Manual Override)' })
  async forceOffline(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    // Use findById service method instead of direct repo access
    const driver = await this.driversService.findById(id);
    if (driver) {
      await this.driversService.setOnline(driver.userId, false);
      await this.adminService.logAction(
        admin.id,
        AdminAction.MERCHANT_SUSPEND, // Re-using for now or add DRIVER_OFFLINE
        'driver',
        id,
        { action: 'force_offline' },
        req.ip,
      );
    }
    return driver;
  }
}
