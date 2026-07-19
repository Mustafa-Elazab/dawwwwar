import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../database/entities/order.entity';

class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productNameAr?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedModifierGroupDto)
  selectedModifiers?: SelectedModifierGroupDto[];
}

class SelectedModifierOptionDto {
  @ApiProperty()
  @IsString()
  optionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceDelta?: number;
}

class SelectedModifierGroupDto {
  @ApiProperty()
  @IsString()
  groupId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupNameAr?: string;

  @ApiProperty({ type: [SelectedModifierOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedModifierOptionDto)
  options: SelectedModifierOptionDto[];
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsString()
  merchantId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsString()
  deliveryAddress: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  deliveryLatitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  deliveryLongitude: number;

  @ApiProperty()
  @IsString()
  deliveryPhone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  deliveryFee: number;

  @ApiProperty({ required: false, description: 'Promo code to apply' })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ required: false, description: 'ISO date string for scheduled delivery' })
  @IsOptional()
  @IsString()
  deliverAt?: string;
}
