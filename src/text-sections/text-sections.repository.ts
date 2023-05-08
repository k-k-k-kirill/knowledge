import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntityRepository } from '../database/entity.repository';
import { TextSectionSchema } from './schemas/text-section.schema';
import { EmbeddingsService } from 'src/embeddings/embeddings.service';

@Injectable()
export class TextSectionsRepository extends EntityRepository<TextSectionSchema> {
  constructor(
    @Inject(SupabaseClient) supabase: SupabaseClient,
    private readonly embeddingsService: EmbeddingsService,
  ) {
    super('text_sections', supabase);
  }

  async searchByPrompt(
    prompt: string,
    wikiId: string,
  ): Promise<TextSectionSchema[]> {
    const queryEmbedding = await this.embeddingsService.createEmbedding(prompt);

    const { data, error } = await this.supabase.rpc('match_text_sections', {
      query_embedding: queryEmbedding,
      wiki_id: wikiId,
      match_threshold: 0.78,
      match_count: 10,
    });

    if (error) {
      throw new Error('Failed to find a matching embedding');
    }

    return data;
  }
}
