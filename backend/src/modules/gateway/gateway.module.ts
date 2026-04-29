import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { GatewayService } from './gateway.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [JwtModule.register({}), forwardRef(() => ChatModule)],
  providers: [AppGateway, GatewayService, WsJwtGuard],
  exports: [GatewayService],
})
export class GatewayModule {}
