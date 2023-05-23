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

@Module({
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
  ],
})
export class ChatModule {}
