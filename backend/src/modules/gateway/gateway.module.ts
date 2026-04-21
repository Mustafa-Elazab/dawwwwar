import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { GatewayService } from './gateway.service';
import { WsJwtGuard } from './ws-jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [AppGateway, GatewayService, WsJwtGuard],
  exports: [GatewayService],
})
export class GatewayModule {}
