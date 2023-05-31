import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Delete,
  Param,
  Get,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { WikisService } from './wikis.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('wikis')
export class WikisController {
  private readonly logger = new Logger(WikisController.name);

  constructor(private readonly wikisService: WikisService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createWikiDto: CreateWikiDto) {
    try {
      await this.wikisService.create(createWikiDto);
    } catch (error) {
      this.logger.error('Error creating wiki: ' + error.message, error.stack);
      throw new InternalServerErrorException('Error creating wiki');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':wiki_id')
  async delete(@Param('wiki_id') wikiId: string) {
    try {
      await this.wikisService.delete(wikiId);
    } catch (error) {
      this.logger.error('Error deleting wiki: ' + error.message, error.stack);
      throw new InternalServerErrorException('Error deleting wiki');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    try {
      return await this.wikisService.list();
    } catch (error) {
      this.logger.error('Error listing wikis: ' + error.message, error.stack);
      throw new InternalServerErrorException('Error listing wikis');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':wikiId')
  async getById(@Param('wikiId') wikiId: string) {
    try {
      const { data } = await this.wikisService.getById(wikiId);

      return data[0];
    } catch (error) {
      this.logger.error(
        'Error getting wiki details: ' + error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Error getting wiki details');
    }
  }
}
