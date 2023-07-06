import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  BadRequestException,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { ChatbotsService } from './chatbots.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('chatbots')
export class ChatbotsController {
  private readonly logger = new Logger(ChatbotsController.name);

  constructor(private readonly chatbotsService: ChatbotsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllChatbots(@Request() req) {
    try {
      const data = await this.chatbotsService.getAllChatbots(req.user.userId);
      return data;
    } catch (error) {
      this.logger.error(`Error fetching chatbots: ${error.message}`);
      throw new BadRequestException('Failed to fetch chatbots');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':chatbotId')
  async getChatbotById(@Request() req, @Param('chatbotId') chatbotId: string) {
    try {
      const { data } = await this.chatbotsService.getChatbotById(
        chatbotId,
        req.user.userId,
      );
      return data[0];
    } catch (error) {
      this.logger.error(`Error fetching chatbot details: ${error.message}`);
      throw new BadRequestException('Failed to fetch chatbot details');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createChatbot(
    @Request() req,
    @Body() createChatbotDto: CreateChatbotDto,
  ) {
    try {
      return await this.chatbotsService.createChatbot(
        createChatbotDto,
        req.user.userId,
      );
    } catch (error) {
      this.logger.error(`Error creating chatbot: ${error.message}`);
      throw new BadRequestException('Failed to create chatbot');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':chatbotId')
  async deleteChatbot(@Request() req, @Param('chatbotId') chatbotId: string) {
    try {
      await this.chatbotsService.deleteChatbot(chatbotId, req.user.userId);
    } catch (error) {
      this.logger.error(`Error deleting chatbot: ${error.message}`);
      throw new BadRequestException('Failed to delete chatbot');
    }
  }
}
