import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('')
  async handleUserPrompt(
    @Body('text') text: string,
    @Body('wikiId') wikiId: string,
  ): Promise<{ response: string }> {
    try {
      const result = await this.chatService.getChatResponse(text, wikiId);
      return result;
    } catch (error) {
      throw new Error('Error getting chat response: ' + error.message);
    }
  }
}
