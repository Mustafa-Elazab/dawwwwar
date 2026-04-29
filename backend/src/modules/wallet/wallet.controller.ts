import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { WalletService } from './wallet.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { PaymobWebhookDto } from './dto/paymob-webhook.dto';
import { Public } from '../../common/decorators/public.decorator';

class RechargeDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsPositive()
  @Min(10)
  amount: number;
}

@ApiTags('Wallet')
@Controller('wallet')
@ApiBearerAuth('access-token')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wallet' })
  getWallet(@CurrentUser() user: UserEntity) {
    return this.walletService.getWallet(user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  getTransactions(@CurrentUser() user: UserEntity) {
    return this.walletService.getTransactions(user.id);
  }

  @Post('recharge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request manual wallet recharge (Phase 2)' })
  requestRecharge(
    @CurrentUser() user: UserEntity,
    @Body('amount') amount: number,
  ) {
    return this.walletService.requestRecharge(user.id, amount);
  }

  @Post('recharge/paymob')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Paymob wallet recharge (Phase 3)' })
  requestPaymobRecharge(
    @CurrentUser() user: UserEntity,
    @Body('amount') amount: number,
  ) {
    return this.walletService.requestRecharge(user.id, amount);
  }

  @Public()
  @Post('paymob-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paymob transaction webhook' })
  async paymobWebhook(
    @Req() req: any,
    @Headers('hmac') hmac: string,
    @Body() dto: PaymobWebhookDto,
  ) {
    // Note: in a real production environment, the raw body should be used for HMAC verification.
    // For this implementation, we use the parsed payload object order for simplicity.
    const isValid = this.walletService.verifyPaymobHmac(dto, hmac);
    if (!isValid) {
      // Return 200 anyway so Paymob stops retrying, but don't process it
      return { received: true };
    }

    await this.walletService.handlePaymobWebhook(dto);
    return { received: true };
  }
}
