import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { TextSectionsService } from '../text-sections/text-sections.service';
import { ConfigService } from '@nestjs/config';
import { TextSectionsRepository } from '../text-sections/text-sections.repository';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { supabaseClientProvider } from '../supabase/supabase.module';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { MessagesRepository } from 'src/messages/messages.repository';
import { PromptsService } from '../prompts/prompts.service';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { ContextBuilderService } from 'src/open-ai/context-builder.service';
import { JwtAuthService } from 'src/auth/jwt-auth.service';

@Module({
  imports: [OpenAiModule],
  controllers: [ChatController],
  providers: [
    supabaseClientProvider,
    SupabaseService,
    ChatService,
    OpenAiService,
    ConfigService,
    TextSectionsService,
    TextSectionsRepository,
    EmbeddingsService,
    FileUploadService,
    MessagesRepository,
    PromptsService,
    ContextBuilderService,
    JwtAuthService,
  ],
  exports: [],
})
export class ChatModule {}
