import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';

@Injectable()
export class MessagesTextSectionsRepository extends EntityRepository<any> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('messages_text_sections', supabase);
  }

  async insertTextSectionsForMessage(messageId, textSections) {
    const data = textSections.map((section) => ({
      message_id: messageId,
      text_section_id: section.id,
    }));

    return this.supabase.from(this.tableName).insert(data);
  }
}
