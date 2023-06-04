// src/wikis/wikis.service.ts
import { Injectable } from '@nestjs/common';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { WikisRepository } from './wikis.repository';
import { WikisSchema } from './schema/wikis.schema';

@Injectable()
export class WikisService {
  constructor(private readonly wikisRepository: WikisRepository) {}

  async create(createWikiDto: CreateWikiDto, userId: string): Promise<void> {
    await this.wikisRepository.create({ ...createWikiDto, user_id: userId });
  }

  async delete(wikiId: string, userId: string): Promise<void> {
    await this.wikisRepository.delete(wikiId, userId);
  }

  async list(userId: string): Promise<WikisSchema[]> {
    const wikis = await this.wikisRepository.findAll(userId);

    return wikis;
  }

  async getById(wikiId: string, userId: string) {
    const wikiWithSources = await this.wikisRepository.getWikiByIdWithSources(
      wikiId,
      userId,
    );

    return wikiWithSources;
  }
}
