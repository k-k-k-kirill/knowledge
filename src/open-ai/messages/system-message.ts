import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ChatMessage } from './chat-message-base';

export class SystemMessage extends ChatMessage {
  public role = ChatCompletionRequestMessageRoleEnum.System;

  constructor(content: string) {
    super(content);
  }
}
