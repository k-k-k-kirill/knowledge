import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export abstract class ChatMessage {
  constructor(public readonly content: string) {}
  public role: ChatCompletionRequestMessageRoleEnum;

  toJSON() {
    return {
      role: this.role,
      content: this.content,
    };
  }
}
