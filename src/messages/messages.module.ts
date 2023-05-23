import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { supabaseClientProvider } from 'src/supabase/supabase.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, supabaseClientProvider],
})
export class MessagesModule {}
