import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { MessagesSchema } from './schema/messages.schema';

@Injectable()
export class MessagesRepository extends EntityRepository<MessagesSchema> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('messages', supabase);
  }

  getMessagesForConversation(conversationId: string, userId: string) {
    return this.supabase
      .from(this.tableName)
      .select(
        `
      id,
      author,
      conversation_id,
      content
      `,
      )
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
  }
}
