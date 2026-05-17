import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from '../admin.service';
import { OrdersService } from '../../orders/orders.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { AdminAction } from '../../../database/entities/admin-audit-log.entity';

@ApiTags('Admin / Orders')
@Controller('admin/orders')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminOrdersController {
  constructor(
    private readonly adminService: AdminService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all orders for admin monitor' })
  findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.ordersService.findAllForAdmin(status, limitNum, offsetNum);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Admin manual order cancellation' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Req() req: Request,
  ) {
    // Re-use existing customerCancel logic but with admin override
    const order = await this.ordersService.customerCancel(id, admin.id, true);
    await this.adminService.logAction(
      admin.id,
      AdminAction.ORDER_CANCEL,
      'order',
      id,
      {},
      req.ip,
    );
    return order;
  }
}
