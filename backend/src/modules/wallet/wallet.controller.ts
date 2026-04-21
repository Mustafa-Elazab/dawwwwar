import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';

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
  @ApiOperation({ summary: 'Request wallet recharge' })
  requestRecharge(
    @CurrentUser() user: UserEntity,
    @Body() dto: RechargeDto,
  ) {
    return this.walletService.requestRecharge(user.id, dto.amount);
  }
}
