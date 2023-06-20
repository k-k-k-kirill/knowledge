import { Socket } from 'socket.io';
import { JwtAuthService } from '../auth/jwt-auth.service';

export function jwtAuthMiddleware(jwtAuthService: JwtAuthService) {
  return async (socket: Socket, next: () => void) => {
    const { authorization } = socket.handshake.headers;
    const bearerToken = authorization.split(' ')[1];
    const isValid = await jwtAuthService.validateToken(bearerToken, socket);

    if (!isValid) {
      socket.disconnect();
    } else {
      next();
    }
  };
}
