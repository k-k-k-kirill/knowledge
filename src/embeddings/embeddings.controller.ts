import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFile,
  BadRequestException,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmbeddingsService } from './embeddings.service';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('upload/:wiki_id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('wiki_id') wikiId: string,
  ) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    try {
      const result = await this.embeddingsService.processUploadedFile(
        file,
        wikiId,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('Error processing file: ' + error.message);
    }
  }

  @Post('url/:wiki_id')
  async addUrl(@Body('url') url: string, @Param('wiki_id') wikiId: string) {
    if (!url) {
      throw new BadRequestException('URL not provided');
    }

    try {
      await this.embeddingsService.processUrl(url, wikiId);
      return { message: 'URL processed successfully' };
    } catch (error) {
      throw new BadRequestException('Error processing URL: ' + error.message);
    }
  }
}
