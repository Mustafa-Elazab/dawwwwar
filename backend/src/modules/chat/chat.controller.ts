import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get chat history for an order' })
  getHistory(@Param('orderId') orderId: string, @CurrentUser() user: UserEntity) {
    return this.chatService.getHistory(orderId, user.id);
  }
}
