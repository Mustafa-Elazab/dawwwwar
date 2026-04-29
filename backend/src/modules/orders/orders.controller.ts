import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PlaceCustomOrderDto } from './dto/place-custom-order.dto';
import { AcceptOrderDto } from './dto/accept-order.dto';
import { RejectOrderDto } from './dto/reject-order.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth('access-token')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Customer ─────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Place a regular order' })
  placeOrder(@CurrentUser() user: UserEntity, @Body() dto: PlaceOrderDto) {
    return this.ordersService.placeOrder(user.id, dto);
  }

  @Post('custom')
  @ApiOperation({ summary: 'Place a custom order' })
  placeCustomOrder(
    @CurrentUser() user: UserEntity,
    @Body() dto: PlaceCustomOrderDto,
  ) {
    return this.ordersService.placeCustomOrder(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my orders (customer)' })
  getMyOrders(@CurrentUser() user: UserEntity) {
    return this.ordersService.getCustomerOrders(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post(':id/tip')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a tip to a completed order' })
  addTip(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('amount') amount: number,
  ) {
    return this.ordersService.addTip(id, user.id, amount);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer cancels a PENDING order' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ordersService.customerCancel(id, user.id);
  }

  // ── Merchant ─────────────────────────────────────────────────────

  @Get('merchant/all')
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get merchant orders' })
  getMerchantOrders(@CurrentUser() user: UserEntity) {
    return this.ordersService.getMerchantOrders(user.id);
  }

  @Post('merchant/:id/accept')
  @Roles(UserRole.MERCHANT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Merchant accepts order' })
  merchantAccept(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: AcceptOrderDto,
  ) {
    return this.ordersService.merchantAccept(id, user.id, dto.prepMinutes);
  }

  @Post('merchant/:id/reject')
  @Roles(UserRole.MERCHANT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Merchant rejects order' })
  merchantReject(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: RejectOrderDto,
  ) {
    return this.ordersService.merchantReject(id, user.id, dto.reason);
  }

  @Post('merchant/:id/ready')
  @Roles(UserRole.MERCHANT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Merchant marks order as ready' })
  merchantMarkReady(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.ordersService.merchantMarkReady(id, user.id);
  }

  // ── Driver ───────────────────────────────────────────────────────

  @Get('driver/available')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get available orders for driver' })
  getAvailable() {
    return this.ordersService.getAvailableOrders();
  }

  @Get('driver/active')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get driver active order' })
  getDriverActive(@CurrentUser() user: UserEntity) {
    return this.ordersService.getDriverActiveOrder(user.id);
  }

  @Post('driver/:id/accept')
  @Roles(UserRole.DRIVER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Driver accepts order' })
  driverAccept(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.ordersService.driverAccept(id, user.id);
  }

  @Post('driver/:id/decline')
  @Roles(UserRole.DRIVER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Driver declines order' })
  driverDecline(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.ordersService.driverDecline(id, user.id);
  }

  @Patch('driver/:id/status')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Driver updates delivery status' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return this.ordersService.updateDeliveryStatus(id, user.id, dto);
  }
}
