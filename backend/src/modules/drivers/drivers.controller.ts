import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { UpdateLocationDto } from './dto/update-location.dto';

class ToggleOnlineDto {
  @ApiProperty()
  @IsBoolean()
  isOnline: boolean;
}

@ApiTags('Drivers')
@Controller('driver')
@ApiBearerAuth('access-token')
@Roles(UserRole.DRIVER)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get driver profile' })
  getProfile(@CurrentUser() user: UserEntity) {
    return this.driversService.getProfile(user.id);
  }

  @Post('online')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle driver online/offline status' })
  toggleOnline(@CurrentUser() user: UserEntity, @Body() dto: ToggleOnlineDto) {
    return this.driversService.setOnline(user.id, dto.isOnline);
  }

  @Patch('location')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update driver location (called frequently)' })
  updateLocation(@CurrentUser() user: UserEntity, @Body() dto: UpdateLocationDto) {
    return this.driversService.updateLocation(user.id, dto);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Get driver earnings summary + weekly chart' })
  getEarnings(@CurrentUser() user: UserEntity) {
    return this.driversService.getEarningsSummary(user.id);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get driver wallet balance' })
  getWallet(@CurrentUser() user: UserEntity) {
    return this.driversService.getWalletBalance(user.id);
  }
}
