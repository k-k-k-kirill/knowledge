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

  async getAllChatbots() {
    const chatbots = await this.chatbotsRepository.findAll();

    return chatbots;
  }

  async getChatbotById(chatbotId: string) {
    const chatbot =
      await this.chatbotsRepository.getChatbotByIdWithConversations(chatbotId);

    return chatbot;
  }

  async createChatbot(createChatbot: CreateChatbotDto): Promise<any> {
    try {
      const { error } = await this.chatbotsRepository.createChatbot(
        createChatbot,
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

  async deleteChatbot(chatbotId: string) {
    await this.chatbotsRepository.deleteChatbotById(chatbotId);
  }
}
