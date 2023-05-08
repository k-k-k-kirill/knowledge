import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ChatMessage } from './chat-message-base';

export class UserMessage extends ChatMessage {
  public role = ChatCompletionRequestMessageRoleEnum.User;

  constructor(content: string) {
    super(content);
  }
}
