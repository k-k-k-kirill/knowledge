import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesTextSectionsRepository } from './messages-text-sections.repository';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly messagesTextSectionsRepository: MessagesTextSectionsRepository,
  ) {}

  async createMessageInConversation(
    conversationId: string,
    messageData: CreateMessageDto,
    userId: string,
    textSections?: any[],
  ) {
    try {
      const { id: messageId } = await this.messagesRepository.create({
        conversation_id: conversationId,
        author: messageData.author,
        content: messageData.content,
        user_id: userId,
      });

      if (textSections && textSections.length > 0) {
        await this.messagesTextSectionsRepository.insertTextSectionsForMessage(
          messageId,
          textSections,
        );
      }
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

  async getMessagesForConversation(conversationId: string, userId: string) {
    try {
      const { data, error } =
        await this.messagesRepository.getMessagesForConversation(
          conversationId,
          userId,
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
