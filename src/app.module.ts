import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from './sources/sources.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload/file-upload.service';
import { TextSectionsModule } from './text-sections/text-sections.module';
import { OpenAiService } from './open-ai/open-ai.service';
import { WikisModule } from './wikis/wikis.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    SourcesModule,
    EmbeddingsModule,
    AuthModule,
    SupabaseModule,
    ConfigModule.forRoot(),
    TextSectionsModule,
    WikisModule,
    FileUploadModule,
    ChatModule,
    ChatbotsModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService,
    SupabaseService,
    FileUploadService,
    OpenAiService,
  ],
})
export class AppModule {}
