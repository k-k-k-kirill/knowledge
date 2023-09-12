import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OpenAiService } from '../open-ai/open-ai.service';
import { TextSectionsService } from '../text-sections/text-sections.service';
import { MessagesRepository } from 'src/messages/messages.repository';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly openAiService: OpenAiService,
    private readonly textSectionsService: TextSectionsService,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  async getChatResponseInStream(
    text: string,
    chatbotId: string,
    conversationId: string | undefined | null,
    userId: string,
  ): Promise<any> {
    try {
      const textSections = await this.getTextSections(text, chatbotId, userId);
      const messages = await this.getConversationMessages(
        conversationId,
        userId,
      );

      const responseStream =
        await this.openAiService.createChatCompletionStream(
          text,
          textSections,
          messages,
        );

      if (!responseStream) {
        throw new InternalServerErrorException(
          'Could not get chat response stream from provider.',
        );
      }

      return { responseStream, textSections };
    } catch (error) {
      this.logger.error('Error getting chat response stream: ', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getChatResponse(
    text: string,
    chatbotId: string,
    conversationId: string | undefined | null,
    userId: string,
  ): Promise<any> {
    try {
      const textSections = await this.getTextSections(text, chatbotId, userId);
      const messages = await this.getConversationMessages(
        conversationId,
        userId,
      );

      const completion = await this.openAiService.createChatCompletion(
        text,
        textSections,
        messages,
      );

      if (!completion) {
        throw new InternalServerErrorException(
          'Could not get chat response stream from provider.',
        );
      }

      return { ...completion, textSections };
    } catch (error) {
      this.logger.error('Error getting chat response stream: ', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async getTextSections(
    text: string,
    chatbotId: string,
    userId: string,
  ) {
    return this.textSectionsService.search(text, chatbotId, userId);
  }

  private async getConversationMessages(
    conversationId: string | undefined | null,
    userId: string,
  ) {
    let messages = [];

    if (conversationId) {
      const { data, error } =
        await this.messagesRepository.getMessagesForConversation(
          conversationId,
          userId,
        );

      if (error) {
        this.logger.error(
          'Error fetching conversation messages: ',
          error.message,
        );
        throw new InternalServerErrorException(error.message);
      }

      if (data) {
        messages = data;
      }
    }

    return messages;
  }
}
