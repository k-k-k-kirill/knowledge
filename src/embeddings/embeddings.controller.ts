import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  BadRequestException,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EmbeddingsService } from './embeddings.service';

@Controller('embeddings')
export class EmbeddingsController {
  private readonly logger = new Logger(EmbeddingsController.name);

  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('upload/:wiki_id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('wiki_id') wikiId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files not provided');
    }

    try {
      const results = await this.embeddingsService.processUploadedFiles(
        files,
        wikiId,
      );
      return results;
    } catch (error) {
      this.logger.error(`Error processing files: ${error}`);
      throw new BadRequestException('Error processing files');
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
      this.logger.error(`Error processing URL: ${error}`);
      throw new BadRequestException('Error processing URL');
    }
  }
}
