import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../../database/entities/order.entity';

const DRIVER_ALLOWED_STATUSES = [
  OrderStatus.AT_SHOP,
  OrderStatus.SHOPPING,
  OrderStatus.PURCHASED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
] as const;

export class UpdateDeliveryStatusDto {
  @ApiProperty({ enum: DRIVER_ALLOWED_STATUSES })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  actualAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receiptImage?: string;
}
