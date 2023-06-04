import { Injectable } from '@nestjs/common';
import { SourcesRepository } from './sources.repository';

@Injectable()
export class SourcesService {
  constructor(private readonly sourcesRepository: SourcesRepository) {}

  async getById(sourceId: string, userId: string) {
    const sourceWithTextSections =
      await this.sourcesRepository.getWikiByIdWithTextSections(
        sourceId,
        userId,
      );

    return sourceWithTextSections;
  }

  async deleteById(sourceId: string, userId: string) {
    await this.sourcesRepository.deleteSourceById(sourceId, userId);
  }
}
