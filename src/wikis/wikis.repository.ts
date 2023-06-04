import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { WikisSchema } from './schema/wikis.schema';

@Injectable()
export class WikisRepository extends EntityRepository<WikisSchema> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('wikis', supabase);
  }

  getWikiByIdWithSources(wikiId: string, userId: string) {
    return this.supabase
      .from(this.tableName)
      .select(
        `
        id,
        name, 
        sources (
          id,
          name,
          type,
          upload_timestamp
        )`,
      )
      .eq('id', wikiId)
      .eq('user_id', userId);
  }
}
