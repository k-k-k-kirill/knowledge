import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { ChatbotsRepository } from './chatbots.repository';

@Injectable()
export class ChatbotsService {
  private readonly logger = new Logger(ChatbotsService.name);

  constructor(private readonly chatbotsRepository: ChatbotsRepository) {}

  async getAllChatbots(userId: string) {
    const chatbots = await this.chatbotsRepository.findAll(userId);

    return chatbots;
  }

  async getChatbotById(chatbotId: string, userId: string) {
    const chatbot =
      await this.chatbotsRepository.getChatbotByIdWithConversations(
        chatbotId,
        userId,
      );

    return chatbot;
  }

  async createChatbot(
    createChatbot: CreateChatbotDto,
    userId: string,
  ): Promise<any> {
    try {
      const { error } = await this.chatbotsRepository.createChatbot(
        createChatbot,
        userId,
      );

      if (error) {
        this.logger.error(`Failed to create chatbot: ${error}`);
        throw new InternalServerErrorException('Failed to create chatbot');
      }
    } catch (error) {
      this.logger.error(`Failed to create chatbot: ${error}`);
      throw new InternalServerErrorException('Failed to create chatbot');
    }
  }

  async deleteChatbot(chatbotId: string, userId: string) {
    await this.chatbotsRepository.deleteChatbotById(chatbotId, userId);
  }
}
