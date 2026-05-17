import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportService } from './services/support.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { TicketStatus } from '../../database/entities/support-ticket.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ResolveTicketDto } from './dto/support.dto';

@ApiTags('Admin / Support')
@Controller('admin/support/tickets')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminTicketsController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  @ApiOperation({ summary: 'List all support tickets' })
  findAll(@Query('status') status?: TicketStatus) {
    return this.supportService.findAllForAdmin(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details for admin' })
  getDetails(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.supportService.getTicketDetails(id, user);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve and close a ticket' })
  resolve(
    @Param('id') id: string,
    @CurrentUser() admin: UserEntity,
    @Body() dto: ResolveTicketDto,
  ) {
    return this.supportService.resolveTicket(id, admin.id, dto);
  }
}
