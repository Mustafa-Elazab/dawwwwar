import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

type PaymobSourceData = {
  pan?: string;
  sub_type?: string;
  type?: string;
};

type PaymobOrder = {
  id: number;
  merchant_order_id?: string;
};

export class PaymobWebhookDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hmac?: string;

  @ApiProperty()
  @IsObject()
  obj: {
    id: number;
    success: boolean;
    amount_cents: number;
    order?: PaymobOrder;
    created_at?: string;
    currency?: string;
    error_occured?: boolean;
    has_parent_transaction?: boolean;
    integration_id?: number;
    is_3d_secure?: boolean;
    is_auth?: boolean;
    is_capture?: boolean;
    is_refunded?: boolean;
    is_standalone_payment?: boolean;
    is_voided?: boolean;
    owner?: number;
    pending?: boolean;
    source_data?: PaymobSourceData;
  };
}
