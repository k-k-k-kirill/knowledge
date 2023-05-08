import { Injectable } from '@nestjs/common';
import { TextExtractionStrategy } from './strategies/text-extraction-strategy.interface';
import { JsonTextExtractionStrategy } from './strategies/json-text-extraction.strategy';
import { PdfTextExtractionStrategy } from './strategies/pdf-text-extraction.strategy';

@Injectable()
export class FileUploadService {
  private strategies: Record<string, TextExtractionStrategy> = {
    'application/json': new JsonTextExtractionStrategy(),
    'application/pdf': new PdfTextExtractionStrategy(),
  };

  async extractTextFromBuffer(
    fileBuffer: Buffer,
    fileType: string,
  ): Promise<string> {
    const strategy = this.strategies[fileType];

    if (!strategy) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    return strategy.extractText(fileBuffer);
  }
}
