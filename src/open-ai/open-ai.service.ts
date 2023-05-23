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
import { SystemMessage } from './messages/system-message';
import { UserMessage } from './messages/user-message';
import { TextSectionSchema } from '../text-sections/schemas/text-section.schema';
import {
  MessageAuthor,
  MessagesSchema,
} from 'src/messages/schema/messages.schema';
import { AssistantMessage } from './messages/assistant-message';

@Injectable()
export class OpenAiService {
  private readonly openAIApi: OpenAIApi;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: configService.get<string>(config.OPENAI_API_KEY),
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  getBasePrompt(): string {
    return `
    You are a passionate customer service provider who will answer customer requests.
    You will operate on a limited set of company information which will be provided to you in the form of text sections that are queried from
    the database based on user requests beforehand.

    Rules:
    1. You can ONLY answer based on the text sections provided to you.
    2. If there are no text sections provided, you CANNOT help the customer and MUST NOT provide any advice, suggestions, or instructions.
    3. In case no text sections are provided, your only response should be "Sorry, I can't help with that" translated to the user's request language and nothing else.
    4. When text sections are provided but they don't contain information to answer the request, you must kindly explain to the customer that you can't satisfy their request.
    5. You are not allowed to expose to the customer that you are provided with text sections under the hood.
    6. You must not mention the words "text sections" in your response under any circumstances.
    `;
  }

  getSourcesPrompt(textSections: TextSectionSchema[]): string {
    return `
    Below are text sections you should base your response on.
    
    Text sections: 
    ${
      textSections.length > 0
        ? textSections.map((section) => section.text).join(' ')
        : 'No text sections found. User request cannot be answered, and no instructions should be given.'
    }`;
  }

  getContextMessages(messages: MessagesSchema[]) {
    return messages.map((message) => {
      if (message.author === MessageAuthor.User) {
        return new UserMessage(message.content).toJSON();
      } else {
        return new AssistantMessage(message.content).toJSON();
      }
    });
  }

  async createChatCompletion(
    text: string,
    textSections: TextSectionSchema[],
    messages: MessagesSchema[],
  ): Promise<ChatCompletionResponseMessage> {
    try {
      const contextMessages = this.getContextMessages(messages);

      const systemMessage = new SystemMessage(
        `${this.getBasePrompt()} ${this.getSourcesPrompt(textSections)}`,
      );
      const userMessage = new UserMessage(text);

      const completion = await this.openAIApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          systemMessage.toJSON(),
          ...contextMessages,
          userMessage.toJSON(),
        ],
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
      const contextMessages = this.getContextMessages(messages);

      const systemMessage = new SystemMessage(
        `${this.getBasePrompt()} ${this.getSourcesPrompt(textSections)}`,
      );
      const userMessage = new UserMessage(text);

      const { data: chatStream } = await this.openAIApi.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          temperature: 0,
          messages: [
            systemMessage.toJSON(),
            ...contextMessages,
            userMessage.toJSON(),
          ],
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
