import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { ChatbotsService } from './chatbots.service';

@Controller('chatbots')
export class ChatbotsController {
  private readonly logger = new Logger(ChatbotsController.name);

  constructor(private readonly chatbotsService: ChatbotsService) {}

  @Get()
  async getAllChatbots() {
    try {
      const data = await this.chatbotsService.getAllChatbots();
      return data;
    } catch (error) {
      this.logger.error(`Error fetching chatbots: ${error.message}`);
      throw new BadRequestException('Failed to fetch chatbots');
    }
  }

  @Get(':chatbotId')
  async getChatbotById(@Param('chatbotId') chatbotId: string) {
    try {
      const { data } = await this.chatbotsService.getChatbotById(chatbotId);
      return data[0];
    } catch (error) {
      this.logger.error(`Error fetching chatbot details: ${error.message}`);
      throw new BadRequestException('Failed to fetch chatbot details');
    }
  }

  @Post()
  async createChatbot(@Body() createChatbotDto: CreateChatbotDto) {
    try {
      await this.chatbotsService.createChatbot(createChatbotDto);
    } catch (error) {
      this.logger.error(`Error creating chatbot: ${error.message}`);
      throw new BadRequestException('Failed to create chatbot');
    }
  }

  @Delete(':chatbotId')
  async deleteChatbot(@Param('chatbotId') chatbotId: string) {
    try {
      await this.chatbotsService.deleteChatbot(chatbotId);
    } catch (error) {
      this.logger.error(`Error deleting chatbot: ${error.message}`);
      throw new BadRequestException('Failed to delete chatbot');
    }
  }
}
