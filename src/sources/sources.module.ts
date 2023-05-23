import { Module } from '@nestjs/common';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { SourcesRepository } from './sources.repository';
import { supabaseClientProvider } from 'src/supabase/supabase.module';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService, SourcesRepository, supabaseClientProvider],
})
export class SourcesModule {}
