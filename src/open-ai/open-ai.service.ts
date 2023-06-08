import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from 'openai';
import { config } from '../config';
import { TextSectionSchema } from '../text-sections/schemas/text-section.schema';
import { MessagesSchema } from 'src/messages/schema/messages.schema';
import { ContextBuilderService } from './context-builder.service';
import { SystemMessage } from './messages/system-message';

@Injectable()
export class OpenAiService {
  private readonly openAIApi: OpenAIApi;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly contextBuilderService: ContextBuilderService,
  ) {
    const configuration = new Configuration({
      apiKey: configService.get<string>(config.OPENAI_API_KEY),
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  async createChatCompletion(
    text: string,
    textSections: TextSectionSchema[],
    messages: MessagesSchema[],
  ): Promise<ChatCompletionResponseMessage> {
    try {
      const contextMessages = this.contextBuilderService.buildMessages(
        text,
        textSections,
        messages,
      );

      const completion = await this.openAIApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: contextMessages,
      });

      return completion.data.choices[0].message;
    } catch (error) {
      this.logger.error(
        'Failed to get chat completion from vendor',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get chat completion from vendor',
      );
    }
  }

  async createChatCompletionStream(
    text: string,
    textSections: TextSectionSchema[],
    messages: MessagesSchema[],
  ) {
    try {
      const contextMessages = this.contextBuilderService.buildMessages(
        text,
        textSections,
        messages,
      );

      const { data: chatStream } = await this.openAIApi.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          temperature: 0,
          messages: contextMessages,
          stream: true,
        },
        { responseType: 'stream' },
      );

      return chatStream;
    } catch (error) {
      this.logger.error(
        'Failed to get chat completion stream from vendor',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get chat completion stream from vendor',
      );
    }
  }

  async createEmbedding(text: string): Promise<any> {
    try {
      const { data: embed } = await this.openAIApi.createEmbedding({
        input: text,
        model: 'text-embedding-ada-002',
      });

      return embed.data[0].embedding;
    } catch (error) {
      this.logger.error('Failed to create embedding', error.stack);
      throw new Error('Failed to create embedding');
    }
  }
}
