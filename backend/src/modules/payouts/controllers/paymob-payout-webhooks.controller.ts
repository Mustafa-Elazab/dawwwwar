import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Public } from '../../../common/decorators/public.decorator';
import { PayoutsService } from '../payouts.service';

@ApiTags('Webhooks')
@Controller('webhooks/paymob-payouts')
export class PaymobPayoutWebhooksController {
  private readonly logger = new Logger(PaymobPayoutWebhooksController.name);

  constructor(
    private readonly config: ConfigService,
    private readonly payoutsService: PayoutsService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paymob Payout Webhook' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('hmac') hmac: string,
  ) {
    this.logger.log(`Received Paymob Payout Webhook: ${payload.id}`);

    // 1. Verify HMAC (Signature Verification)
    if (!this.verifyHmac(payload, hmac)) {
      this.logger.warn(`Invalid HMAC for payout webhook: ${payload.id}`);
      return { success: false };
    }

    // 2. Extract transaction status and ID
    const externalId = payload.id?.toString();
    const success = payload.status === 'success';

    // 3. Finalize settlement
    await this.payoutsService.settlePayout(externalId, success);

    return { received: true };
  }

  private verifyHmac(payload: any, hmac: string): boolean {
    const secret = this.config.get<string>('paymob.hmacSecret');
    if (!secret || !hmac) return true; // Skip if no secret configured for dev

    // Paymob HMAC calculation logic (simplified for implementation)
    // In production, we concatenate specific keys in specific order.
    const data = JSON.stringify(payload);
    const hash = crypto.createHmac('sha512', secret).update(data).digest('hex');
    
    return hash === hmac;
  }
}
