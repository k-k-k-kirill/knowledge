import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  BadRequestException,
  Param,
  Body,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EmbeddingsService } from './embeddings.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('embeddings')
export class EmbeddingsController {
  private readonly logger = new Logger(EmbeddingsController.name);

  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/:wiki_id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Request() req,
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
        req.user.userId,
      );
      return results;
    } catch (error) {
      this.logger.error(`Error processing files: ${error}`);
      throw new BadRequestException('Error processing files');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('url/:wiki_id')
  async addUrl(
    @Request() req,
    @Body('url') url: string,
    @Param('wiki_id') wikiId: string,
  ) {
    if (!url) {
      throw new BadRequestException('URL not provided');
    }

    try {
      await this.embeddingsService.processUrl(url, wikiId, req.user.userId);
      return { message: 'URL processed successfully' };
    } catch (error) {
      this.logger.error(`Error processing URL: ${error}`);
      throw new BadRequestException('Error processing URL');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('text/:wiki_id')
  async addPlainText(
    @Request() req,
    @Body('text') text: string,
    @Param('wiki_id') wikiId: string,
  ) {
    if (!text) {
      throw new BadRequestException('Text not provided');
    }

    try {
      await this.embeddingsService.processText(text, wikiId, req.user.userId);
      return { message: 'Text processed successfully' };
    } catch (error) {
      this.logger.error(`Error processing text: ${error}`);
      throw new BadRequestException('Error processing text');
    }
  }
}
