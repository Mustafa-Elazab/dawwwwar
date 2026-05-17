import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from '../admin.service';
import { MerchantsService } from '../../merchants/merchants.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { AdminAction } from '../../../database/entities/admin-audit-log.entity';

@ApiTags('Admin / Merchants')
@Controller('admin/merchants')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminMerchantsController {
  constructor(
    private readonly adminService: AdminService,
    private readonly merchantsService: MerchantsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all merchants for admin' })
  findAll(@Query('status') status?: string) {
    // For now, reuse findNearby or add findAll to service
    // Let's add a more specific method to MerchantsService
    return this.merchantsService.findAllForAdmin(status);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a merchant' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const merchant = await this.merchantsService.setApprovalStatus(id, true);
    await this.adminService.logAction(
      admin.id,
      AdminAction.MERCHANT_APPROVE,
      'merchant',
      id,
      {},
      req.ip,
    );
    return merchant;
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a merchant' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    const merchant = await this.merchantsService.setApprovalStatus(id, false);
    await this.adminService.logAction(
      admin.id,
      AdminAction.MERCHANT_REJECT,
      'merchant',
      id,
      { reason },
      req.ip,
    );
    return merchant;
  }
}
