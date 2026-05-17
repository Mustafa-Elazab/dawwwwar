import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportService } from './services/support.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { CreateTicketDto, AddTicketMessageDto } from './dto/support.dto';

@ApiTags('Support')
@Controller('support/tickets')
@ApiBearerAuth('access-token')
export class TicketsController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @ApiOperation({ summary: 'Open a support ticket' })
  create(@CurrentUser() user: UserEntity, @Body() dto: CreateTicketDto) {
    return this.supportService.createTicket(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my support tickets' })
  getMy(@CurrentUser() user: UserEntity) {
    return this.supportService.getMyTickets(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details with messages' })
  getDetails(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.supportService.getTicketDetails(id, user);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to a ticket' })
  addMessage(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: AddTicketMessageDto,
  ) {
    return this.supportService.addMessage(id, user, dto);
  }
}
