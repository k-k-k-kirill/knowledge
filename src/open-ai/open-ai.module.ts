import { Module } from '@nestjs/common';
import { ContextBuilderService } from './context-builder.service';
import { PromptsService } from 'src/prompts/prompts.service';

@Module({
  providers: [PromptsService, ContextBuilderService],
})
export class OpenAiModule {}
