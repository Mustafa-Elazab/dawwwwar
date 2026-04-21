import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import type { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token =
      client.handshake.auth['token'] as string | undefined ??
      (client.handshake.headers['authorization'] as string | undefined)
        ?.replace('Bearer ', '');

    if (!token) {
      throw new WsException('Unauthorized: no token');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
      // Attach user payload to socket data for use in handlers
      client.data['user'] = payload;
      return true;
    } catch {
      throw new WsException('Unauthorized: invalid token');
    }
  }
}
