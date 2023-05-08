import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { WikisService } from './wikis.service';
import { CreateWikiDto } from './dto/create-wiki.dto';

@Controller('wikis')
export class WikisController {
  constructor(private readonly wikisService: WikisService) {}

  @Post()
  async create(@Body() createWikiDto: CreateWikiDto) {
    try {
      await this.wikisService.create(createWikiDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating wiki: ' + error.message,
      );
    }
  }
}
