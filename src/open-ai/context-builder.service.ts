import { Injectable } from '@nestjs/common';
import {
  MessagesSchema,
  MessageAuthor,
} from 'src/messages/schema/messages.schema';
import { UserMessage } from './messages/user-message';
import { AssistantMessage } from './messages/assistant-message';
import { TextSectionSchema } from '../text-sections/schemas/text-section.schema';
import { SystemMessage } from './messages/system-message';
import { PromptsService } from 'src/prompts/prompts.service';

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

  buildMessages(
    text: string,
    textSections: TextSectionSchema[],
    messages: MessagesSchema[],
  ) {
    const contextMessages = this.getContextMessages(messages);

    const systemMessage = new SystemMessage(
      `${this.promptsService.getBasePrompt()} ${this.promptsService.getSourcesPrompt(
        textSections,
      )}`,
    );
    const userMessage = new UserMessage(text);

    return [systemMessage.toJSON(), ...contextMessages, userMessage.toJSON()];
  }
}
