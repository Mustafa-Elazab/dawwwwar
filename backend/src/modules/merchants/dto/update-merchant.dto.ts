import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMerchantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
