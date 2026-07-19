import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
  @IsNumber()
  shopLatitude: number;

  @ApiProperty()
  @Type(() => Number)
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
  @Type(() => Number)
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

  @ApiProperty({ required: false, description: 'Legacy client hint. The backend recalculates the fee from coordinates.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  deliveryFee?: number;

  @ApiProperty({ required: false, description: 'ISO date string for scheduled delivery' })
  @IsOptional()
  @IsString()
  deliverAt?: string;
}
