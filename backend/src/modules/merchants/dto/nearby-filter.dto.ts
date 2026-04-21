import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyFilterDto {
  @ApiProperty({ required: false, default: 30.8704 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, default: 31.4741 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, default: 10, description: 'Radius in km' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  radius?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false, enum: ['open', 'all'], default: 'all' })
  @IsOptional()
  filter?: 'open' | 'all';
}
