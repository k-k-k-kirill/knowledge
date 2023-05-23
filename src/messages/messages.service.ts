import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessageInConversation(
    conversationId: string,
    messageData: CreateMessageDto,
  ) {
    try {
      await this.messagesRepository.create({
        conversation_id: conversationId,
        author: messageData.author,
        content: messageData.content,
      });
    } catch (error) {
      this.logger.error(
        'Failed to add message to conversation: ',
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to add message to conversation: ' + error.message,
      );
    }
  }

  async getMessagesForConversation(conversationId: string) {
    try {
      const { data, error } =
        await this.messagesRepository.getMessagesForConversation(
          conversationId,
        );

      if (error) {
        this.logger.error(
          'Failed to fetch messages for conversation: ',
          error.message,
        );
        throw new InternalServerErrorException(
          'Failed to fetch messages for conversation: ' + error.message,
        );
      }

      return data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch messages for conversation: ',
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to fetch messages for conversation: ' + error.message,
      );
    }
  }
}
