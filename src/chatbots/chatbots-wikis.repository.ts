import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';

@Injectable()
export class ChatbotsWikisRepository extends EntityRepository<any> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('chatbots_wikis', supabase);
  }

  async updateWikisForChatbot(chatbotId: string, wikiIds: string[]) {
    return this.supabase.rpc('update_chatbot_wikis', {
      _chatbot_id: chatbotId,
      wiki_ids: wikiIds,
    });
  }
}
