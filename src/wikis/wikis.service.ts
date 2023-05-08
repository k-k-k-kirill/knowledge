// src/wikis/wikis.service.ts
import { Injectable } from '@nestjs/common';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { WikisRepository } from './wikis.repository';

@Injectable()
export class WikisService {
  constructor(private readonly wikisRepository: WikisRepository) {}

  async create(createWikiDto: CreateWikiDto) {
    await this.wikisRepository.create(createWikiDto);
  }
}
