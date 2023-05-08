import { BadRequestException } from '@nestjs/common';
import { TextExtractionStrategy } from './text-extraction-strategy.interface';
import * as JSON5 from 'json5';
import { removeNewlineCharacters } from '../utils';

export class JsonTextExtractionStrategy implements TextExtractionStrategy {
  extractText(fileBuffer: Buffer): string {
    try {
      const json = JSON5.parse(fileBuffer.toString('utf-8'));
      const text = JSON5.stringify(json, null, 2);
      return removeNewlineCharacters(text);
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid file provided.');
    }
  }
}
