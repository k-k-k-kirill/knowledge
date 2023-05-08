import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAiService } from '../open-ai/open-ai.service';
import { TextSectionsService } from '../text-sections/text-sections.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly textSectionsService: TextSectionsService,
  ) {}

  async getChatResponse(text: string, wikiId: string): Promise<any> {
    const textSections = await this.textSectionsService.search(text, wikiId);

    const responseMessage = await this.openAiService.createChatCompletion(
      text,
      textSections,
    );

    if (!responseMessage) {
      throw new InternalServerErrorException(
        'Could not get chat response from provider.',
      );
    }

    return responseMessage;
  }
}
