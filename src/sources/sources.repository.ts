import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { SourcesSchema } from './schema/sources.schema';

@Injectable()
export class SourcesRepository extends EntityRepository<SourcesSchema> {
  constructor(@Inject(SupabaseClient) supabase: SupabaseClient) {
    super('sources', supabase);
  }
}
