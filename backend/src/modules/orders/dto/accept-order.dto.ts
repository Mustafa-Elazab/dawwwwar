import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AcceptOrderDto {
  @ApiProperty({ description: 'Preparation time in minutes', example: 15 })
  @IsNumber()
  @IsPositive()
  prepMinutes: number;
}
