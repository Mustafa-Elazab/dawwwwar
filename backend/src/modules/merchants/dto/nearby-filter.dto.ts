import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class NearbyFilterDto {
  @ApiProperty({ required: false, default: 30.8704 })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.lat)
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, description: 'Alias for latitude' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false, default: 31.4741 })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.lng)
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, description: 'Alias for longitude' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;

  @ApiProperty({ required: false, default: 50, description: 'Radius in km' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  radius?: number;

  @ApiProperty({ required: false, description: 'Alias for radius' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  radiusKm?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, enum: ['open', 'all'], default: 'all' })
  @IsOptional()
  filter?: 'open' | 'all';

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;
}
