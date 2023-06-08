import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { EmbeddingsController } from './embeddings.controller';
import { FileUploadService } from '../file-upload/file-upload.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { PromptsService } from 'src/prompts/prompts.service';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { ContextBuilderService } from 'src/open-ai/context-builder.service';

@Module({
  imports: [FileUploadModule, OpenAiModule],
  providers: [
    EmbeddingsService,
    FileUploadService,
    OpenAiService,
    ConfigService,
    SupabaseService,
    PromptsService,
    ContextBuilderService,
  ],
  controllers: [EmbeddingsController],
})
export class EmbeddingsModule {}
