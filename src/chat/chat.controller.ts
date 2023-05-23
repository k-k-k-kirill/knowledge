import {
  Controller,
  Post,
  Body,
  Header,
  Res,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post('')
  async handleUserPrompt(
    @Body('text') text: string,
    @Body('chatbotId') chatbotId: string,
    @Body('conversationId') conversationId: string,
  ): Promise<{ response: string }> {
    try {
      const result = await this.chatService.getChatResponse(
        text,
        chatbotId,
        conversationId,
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting chat response: ', error.message);
      throw new HttpException(
        'Error getting chat response: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  async handleUserPromptInStream(
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
