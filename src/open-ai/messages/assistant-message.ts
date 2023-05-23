import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ChatMessage } from './chat-message-base';

export class AssistantMessage extends ChatMessage {
  public role = ChatCompletionRequestMessageRoleEnum.Assistant;

  constructor(content: string) {
    super(content);
  }
}
