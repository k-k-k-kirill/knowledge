import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class OpenAiService {
  private readonly openAIApi: OpenAIApi;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: configService.get<string>(config.OPENAI_API_KEY),
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  getBasePrompt(): string {
    return `
    You are a passionate customer service provider who will answer customer requests.
    You will operate on limited set of company information which will be provided to you in form of text sections that are queried from
    database based on user request beforehand.

    Rules:
    1. You can ONLY answer based on the text sections provided to you.
    2. If there are no text sections provided, you CANNOT help the customer and MUST NOT provide any advice, suggestions, or instructions.
    3. In case no text sections are provided, your only response should be "Sorry, I can't help with that" translated to user request language and nothing else.
    4. When text sections are provided, but they don't contain information to answer the request, you must kindly explain to the customer that you can't satisfy their request.
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
        : 'No text sections found. User request cannot be answered and no instructions should be given.'
    }`;
  }

  async createChatCompletion(
    text: string,
    textSections: TextSectionSchema[],
  ): Promise<ChatCompletionResponseMessage> {
    try {
      const systemMessage = new SystemMessage(
        `${this.getBasePrompt()} ${this.getSourcesPrompt(textSections)}`,
      );
      const userMessage = new UserMessage(text);

      console.log(
        `${this.getBasePrompt()} ${this.getSourcesPrompt(textSections)}`,
      );

      const completion = await this.openAIApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [systemMessage.toJSON(), userMessage.toJSON()],
      });

      return completion.data.choices[0].message;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get chat completion from vendor',
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
    } catch (err) {
      throw new Error('Failed to create embedding');
    }
  }
}
