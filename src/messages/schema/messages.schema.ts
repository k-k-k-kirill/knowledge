export enum MessageAuthor {
  User = 'User',
  Chatbot = 'Chatbot',
}

export class MessagesSchema {
  id: string;
  conversation_id: string;
  author: MessageAuthor;
  content: string;
  embedding: number[];
  user_id: string;
}
