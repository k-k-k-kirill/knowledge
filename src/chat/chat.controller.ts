import {
  Controller,
  Header,
  Res,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { JwtCookieAuthGuard } from '../auth/auth-cookie.guard';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtCookieAuthGuard)
  @Get('/stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  async handleUserPromptInStream(
    @Request() req,
    @Query('text') text: string,
    @Query('chatbotId') chatbotId: string,
    @Query('conversationId') conversationId: string | undefined | null,
    @Res() res: Response,
  ) {
    try {
      const chatStream = await this.chatService.getChatResponseInStream(
        text,
        chatbotId,
        conversationId,
        req.user.userId,
      );

      for await (const data of chatStream) {
        const jsonData = data.toString();
        res.write(jsonData);
      }

      res.end();
    } catch (error) {
      this.logger.error('Error getting chat response: ', error.message);
      throw new HttpException(
        'Error getting chat response: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
