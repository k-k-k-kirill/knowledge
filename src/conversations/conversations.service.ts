import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  async findAll(chatbotId: string) {
    try {
      const { data } = await this.conversationsRepository.findAllForChatbot(
        chatbotId,
      );
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch conversations: ', error.message);
      throw new InternalServerErrorException(
        'Failed to fetch conversations: ' + error.message,
      );
    }
  }

  async delete(conversationId: string) {
    try {
      await this.conversationsRepository.delete(conversationId);
    } catch (error) {
      this.logger.error('Failed to delete conversation: ', error.message);
      throw new InternalServerErrorException(
        'Failed to delete conversation: ' + error.message,
      );
    }
  }

  async create(conversationData: CreateConversationDto) {
    try {
      const { data: conversationId, error } =
        await this.conversationsRepository.createConversation(conversationData);

      if (error) {
        this.logger.error('Failed to create new conversation: ', error.message);
        throw new InternalServerErrorException(
          'Failed to create new conversation: ' + error.message,
        );
      }

      return conversationId;
    } catch (error) {
      this.logger.error('Failed to create new conversation: ', error.message);
      throw new InternalServerErrorException(
        'Failed to create new conversation: ' + error.message,
      );
    }
  }
}
