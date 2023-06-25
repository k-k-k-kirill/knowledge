import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':conversationId')
  postMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body('messageData') messageData: CreateMessageDto,
    @Body('textSections') textSections?: any[],
  ) {
    return this.messagesService.createMessageInConversation(
      conversationId,
      messageData,
      req.user.userId,
      textSections,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  async getMessagesForConversation(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    const data = await this.messagesService.getMessagesForConversation(
      conversationId,
      req.user.userId,
    );

    return data;
  }
}
