import { Injectable } from '@nestjs/common';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { WikisRepository } from './wikis.repository';
import { WikisSchema } from './schema/wikis.schema';
import { UpdateWikiDto } from './dto/update-wiki.dto';

@Injectable()
export class WikisService {
  constructor(private readonly wikisRepository: WikisRepository) {}

  async create(
    createWikiDto: CreateWikiDto,
    userId: string,
  ): Promise<WikisSchema> {
    return await this.wikisRepository.create({
      ...createWikiDto,
      user_id: userId,
    });
  }

  async update(
    wikiId: string,
    updateWikiDto: UpdateWikiDto,
    userId: string,
  ): Promise<void> {
    return await this.wikisRepository.update(
      wikiId,
      {
        ...updateWikiDto,
      },
      userId,
    );
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
