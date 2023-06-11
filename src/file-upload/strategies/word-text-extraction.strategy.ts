import { TextExtractionStrategy } from './text-extraction-strategy.interface';
import { BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

export class WordTextExtractionStrategy implements TextExtractionStrategy {
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      const { value: text } = await mammoth.extractRawText({
        buffer: fileBuffer,
      });

      // Remove newline characters and null bytes
      const finalText = text.replace(/[\n\r]+/g, ' ').replace(/\u0000/g, ' ');

      return finalText;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid file provided.');
    }
  }
}
