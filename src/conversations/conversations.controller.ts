import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllConversations(@Request() req, @Query('chatbotId') chatbotId: string) {
    return this.conversationsService.findAll(chatbotId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createConversation(
    @Request() req,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(
      createConversationDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':conversationId')
  deleteConversation(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.conversationsService.delete(conversationId, req.user.userId);
  }
}
