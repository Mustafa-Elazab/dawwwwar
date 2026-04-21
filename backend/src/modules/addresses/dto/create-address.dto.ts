import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'شارع الجمهورية، سنبلاوين' })
  @IsString()
  address: string;

  @ApiProperty({ example: 30.872 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 31.476 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buildingNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({ example: '01011111111' })
  @IsString()
  @Matches(/^01[0125]\d{8}$/, { message: 'Invalid Egyptian phone number' })
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isDefault: boolean;
}
