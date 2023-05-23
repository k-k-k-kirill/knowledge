import { MessageAuthor } from '../schema/messages.schema';

export class CreateMessageDto {
  author: MessageAuthor;
  conversationId: string;
  content: string;
}
