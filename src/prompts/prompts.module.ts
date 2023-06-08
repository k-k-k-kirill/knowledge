import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { ContextBuilderService } from 'src/open-ai/context-builder.service';

@Module({
  providers: [
    PromptsService,
    EmbeddingsService,
    OpenAiService,
    FileUploadService,
    SupabaseService,
    ConfigService,
    ContextBuilderService,
  ],
})
export class PromptsModule {}
