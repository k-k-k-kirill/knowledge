import { Module } from '@nestjs/common';
import { TextSectionsController } from './text-sections.controller';
import { TextSectionsService } from './text-sections.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { TextSectionsRepository } from './text-sections.repository';
import { supabaseClientProvider } from '../supabase/supabase.module';
import { OpenAiService } from '../open-ai/open-ai.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [TextSectionsController],
  providers: [
    TextSectionsService,
    TextSectionsRepository,
    EmbeddingsService,
    supabaseClientProvider,
    OpenAiService,
    SupabaseService,
    ConfigService,
  ],
})
export class TextSectionsModule {}
