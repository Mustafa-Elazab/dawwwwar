import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';

export class PaymobWebhookDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsObject()
  obj: {
    id: number;
    success: boolean;
    amount_cents: number;
    order: {
      id: number;
      merchant_order_id: string; // we will store userId:timestamp here
    };
    [key: string]: any;
  };
}
