import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { RequestPayoutDto } from './dto/request-payout.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';
import { Idempotent } from '../../common/decorators/idempotent.decorator';

@ApiTags('Payouts')
@Controller('payouts')
@ApiBearerAuth('access-token')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.DRIVER, UserRole.MERCHANT)
  @Idempotent()
  @ApiOperation({ summary: 'Request a payout (withdrawal)' })
  request(@CurrentUser() user: UserEntity, @Body() dto: RequestPayoutDto) {
    return this.payoutsService.requestPayout(user.id, dto);
  }

  @Get('my')
  @Roles(UserRole.DRIVER, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get current user payout history' })
  getMy(@CurrentUser() user: UserEntity) {
    return this.payoutsService.getMyPayouts(user.id);
  }
}
