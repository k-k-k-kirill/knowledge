import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { supabaseClientProvider } from 'src/supabase/supabase.module';
import { MessagesTextSectionsRepository } from './messages-text-sections.repository';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesRepository,
    MessagesTextSectionsRepository,
    supabaseClientProvider,
  ],
})
export class MessagesModule {}
