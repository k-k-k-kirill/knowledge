import { Injectable } from '@nestjs/common';
import {
  MessagesSchema,
  MessageAuthor,
} from '../messages/schema/messages.schema';
import { UserMessage } from './messages/user-message';
import { AssistantMessage } from './messages/assistant-message';
import { TextSectionSchema } from '../text-sections/schemas/text-section.schema';
import { SystemMessage } from './messages/system-message';
import { PromptsService } from 'src/prompts/prompts.service';
import { encode, decode, isWithinTokenLimit } from 'gpt-tokenizer';

@Injectable()
export class ContextBuilderService {
  constructor(private readonly promptsService: PromptsService) {}

  getContextMessages(messages: MessagesSchema[]) {
    return messages.map((message) => {
      if (message.author === MessageAuthor.User) {
        return new UserMessage(message.content).toJSON();
      } else {
        return new AssistantMessage(message.content).toJSON();
      }
    });
  }

  truncateContextMessages(
    systemMessage: SystemMessage,
    messages: any[],
    userMessage: UserMessage,
  ): any[] {
    const truncatedMessages = [];
    const tokenLimit = 3096;

    const systemMessageTokenCount = encode(
      JSON.stringify(systemMessage.toJSON()),
    ).length;

    const userMessageTokenCount = encode(
      JSON.stringify(userMessage.toJSON()),
    ).length;

    let totalTokens = systemMessageTokenCount + userMessageTokenCount;

    for (let i = messages.length - 1; i >= 0; i--) {
      const messageTokenCount = encode(JSON.stringify(messages[i])).length;

      if (totalTokens + messageTokenCount < tokenLimit) {
        truncatedMessages.unshift(messages[i]);
        totalTokens += messageTokenCount;
      } else {
        break;
      }
    }

    return truncatedMessages;
  }

  buildMessages(
    text: string,
    textSections: TextSectionSchema[],
    messages: MessagesSchema[],
  ) {
    const systemMessage = new SystemMessage(
      `${this.promptsService.getBasePrompt()} ${this.promptsService.getSourcesPrompt(
        textSections,
      )}`,
    );
    const userMessage = new UserMessage(text);

    const contextMessages = this.getContextMessages(messages);

    const truncatedContextMessages = this.truncateContextMessages(
      systemMessage,
      contextMessages,
      userMessage,
    );

    return [systemMessage.toJSON(), ...truncatedContextMessages];
  }
}
