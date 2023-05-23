import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  getAllConversations(@Query('chatbotId') chatbotId: string) {
    return this.conversationsService.findAll(chatbotId);
  }

  @Post()
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  @Delete(':conversationId')
  deleteConversation(@Param('conversationId') conversationId: string) {
    return this.conversationsService.delete(conversationId);
  }
}
