import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentMethod } from '../../../database/entities/order.entity';

export class PlaceCustomOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopName?: string;

  @ApiProperty()
  @IsString()
  shopAddress: string;

  @ApiProperty()
  @IsNumber()
  shopLatitude: number;

  @ApiProperty()
  @IsNumber()
  shopLongitude: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itemsDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itemsVoiceNote?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  itemsImages?: string[];

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  estimatedBudget: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsString()
  deliveryAddress: string;

  @ApiProperty()
  @IsNumber()
  deliveryLatitude: number;

  @ApiProperty()
  @IsNumber()
  deliveryLongitude: number;

  @ApiProperty()
  @IsString()
  deliveryPhone: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  deliveryFee: number;

  @ApiProperty({ required: false, description: 'ISO date string for scheduled delivery' })
  @IsOptional()
  @IsString()
  deliverAt?: string;
}
