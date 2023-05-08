import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { TextSectionsService } from './text-sections.service';

@Controller('text-sections')
export class TextSectionsController {
  constructor(private readonly textSectionsService: TextSectionsService) {}

  @Get('search')
  async search(
    @Query('prompt') prompt: string,
    @Query('wiki_id') wikiId: string,
  ) {
    if (!wikiId) {
      throw new BadRequestException('wiki_id parameter is required');
    }
    const results = await this.textSectionsService.search(prompt, wikiId);
    return results;
  }
}
