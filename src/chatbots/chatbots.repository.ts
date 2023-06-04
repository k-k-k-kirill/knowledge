import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { ChatbotsSchema } from './schema/chatbots.schema';
import { CreateChatbotDto } from './dto/create-chatbot.dto';

@Injectable()
export class ChatbotsRepository extends EntityRepository<ChatbotsSchema> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('chatbots', supabase);
  }

  getChatbotByIdWithConversations(chatbotId: string, userId: string) {
    return this.supabase
      .from(this.tableName)
      .select(
        `
        id,
        name,
        wikis (
            id,
            name
        )
        `,
      )
      .eq('id', chatbotId)
      .eq('user_id', userId);
  }

  createChatbot(createChatbot: CreateChatbotDto, userId: string) {
    try {
      return this.supabase.rpc('create_chatbot', {
        name: createChatbot.name,
        wiki_ids: createChatbot.wikiIds,
        user_id: userId,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create chatbot: ' + error,
      );
    }
  }

  deleteChatbotById(chatbotId: string, userId: string) {
    return this.delete(chatbotId, userId);
  }
}
