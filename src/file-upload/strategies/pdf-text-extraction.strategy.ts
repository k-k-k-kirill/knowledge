import { BadRequestException } from '@nestjs/common';
import { TextExtractionStrategy } from './text-extraction-strategy.interface';
import * as pdfParse from 'pdf-parse';
import { removeNewlineCharacters } from '../utils';

export class PdfTextExtractionStrategy implements TextExtractionStrategy {
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      const parsedData = await pdfParse(fileBuffer);
      const text = parsedData.text;
      const cleanedText = removeNewlineCharacters(text);
      return cleanedText.replace(/\u0000/g, ' ');
    } catch (err) {
      throw new BadRequestException('Invalid file provided.');
    }
  }
}
