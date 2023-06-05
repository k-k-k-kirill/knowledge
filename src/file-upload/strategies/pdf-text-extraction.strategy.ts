import { BadRequestException } from '@nestjs/common';
import { TextExtractionStrategy } from './text-extraction-strategy.interface';
import * as PDFParser from 'pdf-parse';
import * as Tesseract from 'tesseract.js';
import * as pdf2img from 'pdf-img-convert';

export class PdfTextExtractionStrategy implements TextExtractionStrategy {
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      // Extract text using pdf-parse
      const parsedData = await PDFParser(fileBuffer);
      const parsedText = parsedData.text;

      // Combine parsed text and OCR text
      const combinedText = `${parsedText}`;

      // Remove newline characters and null bytes
      const finalText = combinedText
        .replace(/[\n\r]+/g, ' ')
        .replace(/\u0000/g, ' ');

      return finalText;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid file provided.');
    }
  }
}
