import { Injectable } from '@nestjs/common';
import { TextSectionsRepository } from './text-sections.repository';

@Injectable()
export class TextSectionsService {
  constructor(
    private readonly textSectionsRepository: TextSectionsRepository,
  ) {}

  async search(prompt: string, wikiId: string) {
    // Implement your search logic here, e.g., call the repository to find relevant text sections
    const results = await this.textSectionsRepository.searchByPrompt(
      prompt,
      wikiId,
    );
    return results;
  }
}
