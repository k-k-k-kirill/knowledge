import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtAuthService } from '../auth/jwt-auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtAuthService: JwtAuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    const bearerToken = authorization.split(' ')[1];

    return this.jwtAuthService.validateToken(bearerToken, client);
  }
}
