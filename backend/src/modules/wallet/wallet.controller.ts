import { Body, Controller, ForbiddenException, Get, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { WalletService } from './wallet.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Idempotent } from '../../common/decorators/idempotent.decorator';
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
  @Idempotent()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request manual wallet recharge (Phase 2)' })
  requestRecharge(
    @CurrentUser() user: UserEntity,
    @Body() dto: RechargeDto,
  ) {
    return this.walletService.requestRecharge(user.id, dto.amount);
  }

  @Post('recharge/paymob')
  @Idempotent()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Paymob wallet recharge (Phase 3)' })
  requestPaymobRecharge(
    @CurrentUser() user: UserEntity,
    @Body() dto: RechargeDto,
  ) {
    return this.walletService.requestRecharge(user.id, dto.amount);
  }

  @Public()
  @Post(['paymob-webhook', 'webhook/paymob'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paymob transaction webhook' })
  async paymobWebhook(
    @Headers('hmac') hmac: string,
    @Body() dto: PaymobWebhookDto,
  ) {
    const isValid = this.walletService.verifyPaymobHmac(dto, hmac ?? dto.hmac);
    if (!isValid) {
      throw new ForbiddenException('Invalid Paymob HMAC signature');
    }

    await this.walletService.handlePaymobWebhook(dto);
    return { received: true };
  }
}
