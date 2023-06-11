import {
  Injectable,
  UnsupportedMediaTypeException,
  Logger,
} from '@nestjs/common';
import { TextExtractionStrategy } from './strategies/text-extraction-strategy.interface';
import { JsonTextExtractionStrategy } from './strategies/json-text-extraction.strategy';
import { PdfTextExtractionStrategy } from './strategies/pdf-text-extraction.strategy';
import { WordTextExtractionStrategy } from './strategies/word-text-extraction.strategy';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  private strategies: Record<string, TextExtractionStrategy> = {
    'application/json': new JsonTextExtractionStrategy(),
    'application/pdf': new PdfTextExtractionStrategy(),
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      new WordTextExtractionStrategy(),
  };

  async extractTextFromBuffer(
    fileBuffer: Buffer,
    fileType: string,
  ): Promise<string> {
    const strategy = this.strategies[fileType];

    if (!strategy) {
      this.logger.error(`Unsupported file type: ${fileType}`);
      throw new UnsupportedMediaTypeException(
        `Unsupported file type: ${fileType}`,
      );
    }

    try {
      return await strategy.extractText(fileBuffer);
    } catch (error) {
      this.logger.error('Failed to extract text from buffer: ', error.message);
      throw new Error('Failed to extract text from buffer: ' + error.message);
    }
  }
}
