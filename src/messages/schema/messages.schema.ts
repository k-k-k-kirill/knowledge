import { SourcesSchema } from 'src/sources/schema/sources.schema';
import { TextSectionSchema } from 'src/text-sections/schemas/text-section.schema';

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

export interface MessagesResponse extends MessagesSchema {
  text_sections: TextSectionResponse[];
}

interface TextSectionResponse extends TextSectionSchema {
  sources: SourcesSchema;
}
