import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':conversationId')
  postMessage(
    @Param('conversationId') conversationId: string,
    @Body() messageData: CreateMessageDto,
  ) {
    return this.messagesService.createMessageInConversation(
      conversationId,
      messageData,
    );
  }

  @Get(':conversationId')
  async getMessagesForConversation(
    @Param('conversationId') conversationId: string,
  ) {
    const data = await this.messagesService.getMessagesForConversation(
      conversationId,
    );

    return data;
  }
}
