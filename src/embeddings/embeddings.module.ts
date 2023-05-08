import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { EmbeddingsController } from './embeddings.controller';
import { FileUploadService } from '../file-upload/file-upload.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  providers: [
    EmbeddingsService,
    FileUploadService,
    OpenAiService,
    ConfigService,
    SupabaseService,
  ],
  controllers: [EmbeddingsController],
})
export class EmbeddingsModule {}
