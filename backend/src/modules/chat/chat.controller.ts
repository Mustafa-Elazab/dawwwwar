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
  async getHistory(@Param('orderId') orderId: string, @CurrentUser() user: UserEntity) {
    const conversation = await this.chatService.getOrCreateConversation(orderId, user);
    return this.chatService.getMessages(conversation.id);
  }
}
