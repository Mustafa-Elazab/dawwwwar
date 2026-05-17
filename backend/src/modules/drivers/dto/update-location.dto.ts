import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ required: false, description: 'Horizontal accuracy in meters' })
  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @ApiProperty({ required: false, description: 'Speed in meters/second' })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiProperty({ required: false, description: 'Device battery level (0.0 to 1.0)' })
  @IsOptional()
  @IsNumber()
  batteryLevel?: number;

  @ApiProperty({ required: false, description: 'App foreground/background state' })
  @IsOptional()
  @IsString()
  appState?: string;

  @ApiProperty({ required: false, description: 'Strictly increasing sequence number' })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiProperty({ required: false, description: 'Device timestamp of the location fix' })
  @IsOptional()
  @IsString()
  timestamp?: string;
}
