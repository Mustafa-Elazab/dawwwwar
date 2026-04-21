import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: 30.8704 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 31.4741 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false, example: 90 })
  @IsOptional()
  @IsNumber()
  heading?: number;
}
