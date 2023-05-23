// src/wikis/wikis.service.ts
import { Injectable } from '@nestjs/common';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { WikisRepository } from './wikis.repository';
import { WikisSchema } from './schema/wikis.schema';

@Injectable()
export class WikisService {
  constructor(private readonly wikisRepository: WikisRepository) {}

  async create(createWikiDto: CreateWikiDto): Promise<void> {
    await this.wikisRepository.create(createWikiDto);
  }

  async delete(wikiId: string): Promise<void> {
    await this.wikisRepository.delete(wikiId);
  }

  async list(): Promise<WikisSchema[]> {
    const wikis = await this.wikisRepository.findAll();

    return wikis;
  }

  async getById(wikiId: string) {
    const wikiWithSources = await this.wikisRepository.getWikiByIdWithSources(
      wikiId,
    );

    return wikiWithSources;
  }
}
