import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { SocketWithUserId } from './types';
import { jwtAuthMiddleware } from '../auth/ws.middleware';
import { JwtAuthService } from '../auth/jwt-auth.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  afterInit(server: Server) {
    server.use(jwtAuthMiddleware(this.jwtAuthService));
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleChatMessage(
    @ConnectedSocket() client: SocketWithUserId,
    @MessageBody() body: any,
  ) {
    try {
      const { text, chatbotId, conversationId } = body;
      const chatStream = await this.chatService.getChatResponseInStream(
        text,
        chatbotId,
        conversationId,
        client.userId as string,
      );

      for await (const data of chatStream) {
        const dataString = data.toString();

        if (dataString.includes('[DONE]')) {
          client.emit('response', '[DONE]');
          return;
        }

        const chunks = dataString.trim().split(/\n+/);

        chunks.forEach((chunkString) => {
          const chunkJSON = chunkString.replace('data: ', '');
          const chunk = JSON.parse(chunkJSON);
          client.emit('response', chunk);
        });
      }
    } catch (error) {
      this.logger.error('Error getting chat response: ', error.message);
      client.emit('error', 'Error getting chat response: ' + error.message);
    }
  }
}
