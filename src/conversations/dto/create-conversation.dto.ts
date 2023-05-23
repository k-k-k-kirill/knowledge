import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

export class CreateConversationDto {
  readonly chatbotId: string;
  readonly messages?: CreateMessageDto[];
}
