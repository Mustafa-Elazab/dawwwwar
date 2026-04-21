import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectOrderDto {
  @ApiProperty({ example: 'Too busy right now' })
  @IsString()
  reason: string;
}
