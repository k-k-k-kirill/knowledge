import {
  Controller,
  Get,
  Query,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TextSectionsService } from './text-sections.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('text-sections')
export class TextSectionsController {
  constructor(private readonly textSectionsService: TextSectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(
    @Request() req,
    @Query('prompt') prompt: string,
    @Query('wiki_id') wikiId: string,
  ) {
    if (!wikiId) {
      throw new BadRequestException('wiki_id parameter is required');
    }
    const results = await this.textSectionsService.search(
      prompt,
      wikiId,
      req.user.userId,
    );
    return results;
  }
}
