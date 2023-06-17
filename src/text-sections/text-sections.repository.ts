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
    chatbotId: string,
    userId: string,
  ): Promise<TextSectionSchema[]> {
    const queryEmbedding = await this.embeddingsService.createEmbedding(prompt);

    const { data, error } = await this.supabase.rpc('match_text_sections', {
      query_embedding: queryEmbedding,
      chatbot_id: chatbotId,
      match_threshold: 0.7,
      match_count: 20,
      user_id: userId,
    });

    if (error) {
      console.log(error);
      throw new Error('Failed to find a matching embedding');
    }

    return data;
  }
}
