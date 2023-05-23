import { Injectable } from '@nestjs/common';
import { TextSectionsRepository } from './text-sections.repository';

@Injectable()
export class TextSectionsService {
  constructor(
    private readonly textSectionsRepository: TextSectionsRepository,
  ) {}

  async search(prompt: string, chatbotId: string) {
    const results = await this.textSectionsRepository.searchByPrompt(
      prompt,
      chatbotId,
    );
    return results;
  }
}
