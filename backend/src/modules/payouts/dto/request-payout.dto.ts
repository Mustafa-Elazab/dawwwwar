import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, Min } from 'class-validator';
import { PayoutMethod } from '../../../database/entities/payout-request.entity';

export class RequestPayoutDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsPositive()
  @Min(50)
  amount: number;

  @ApiProperty({ enum: PayoutMethod })
  @IsEnum(PayoutMethod)
  method: PayoutMethod;
}
