import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { ConversationsSchema } from './schema/conversations.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsRepository extends EntityRepository<ConversationsSchema> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('conversations', supabase);
  }

  findAllForChatbot(chatbotId: string) {
    return this.supabase
      .from(this.tableName)
      .select(
        `
        id,
        chatbot_id,
        started_at,
        ended_at,
        messages (
            id,
            conversation_id,
            author,
            content,
            created_at
        )
        `,
      )
      .eq('chatbot_id', chatbotId)
      .order('started_at', { ascending: false });
  }

  createConversation(conversationData: CreateConversationDto) {
    return this.supabase.rpc('create_conversation', {
      conversation_data: {
        chatbot_id: conversationData.chatbotId,
        messages: conversationData.messages,
      },
    });
  }
}
