import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PayoutsService } from '../../payouts/payouts.service';
import { AdminService } from '../admin.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { AdminAction } from '../../../database/entities/admin-audit-log.entity';

@ApiTags('Admin / Payouts')
@Controller('admin/payouts')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminPayoutsController {
  constructor(
    private readonly adminService: AdminService,
    private readonly payoutsService: PayoutsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all payout requests' })
  findAll() {
    return this.payoutsService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payout details with events' })
  getDetails(@Param('id') id: string) {
    return this.payoutsService.getPayoutDetails(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve and initiate payout' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const payout = await this.payoutsService.approvePayout(id);
    await this.adminService.logAction(
      admin.id,
      AdminAction.WALLET_ADJUST, // Re-using as adjustment or add PAYOUT_APPROVE
      'payout',
      id,
      { status: payout.status },
      req.ip,
    );
    return payout;
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject payout request' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const payout = await this.payoutsService.rejectPayout(id, reason);
    await this.adminService.logAction(
      admin.id,
      AdminAction.WALLET_ADJUST,
      'payout',
      id,
      { reason },
      req.ip,
    );
    return payout;
  }
}
