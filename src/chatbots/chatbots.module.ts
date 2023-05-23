import { Module } from '@nestjs/common';
import { ChatbotsController } from './chatbots.controller';
import { ChatbotsService } from './chatbots.service';
import { ChatbotsRepository } from './chatbots.repository';
import { supabaseClientProvider } from 'src/supabase/supabase.module';

@Module({
  controllers: [ChatbotsController],
  providers: [ChatbotsService, ChatbotsRepository, supabaseClientProvider],
})
export class ChatbotsModule {}
