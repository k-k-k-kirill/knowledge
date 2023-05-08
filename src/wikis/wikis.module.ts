import { Module } from '@nestjs/common';
import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { WikisRepository } from './wikis.repository';
import { supabaseClientProvider } from '../supabase/supabase.module';

@Module({
  controllers: [WikisController],
  providers: [WikisService, WikisRepository, supabaseClientProvider],
})
export class WikisModule {}
