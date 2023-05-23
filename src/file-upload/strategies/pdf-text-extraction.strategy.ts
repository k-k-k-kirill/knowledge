import { BadRequestException } from '@nestjs/common';
import { TextExtractionStrategy } from './text-extraction-strategy.interface';
import * as PDFParser from 'pdf-parse';
import * as Tesseract from 'tesseract.js';
import * as pdf2img from 'pdf-img-convert';

export class PdfTextExtractionStrategy implements TextExtractionStrategy {
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      // Convert PDF to images
      const imageBuffers = await this.convertPdfToImages(fileBuffer);

      // Extract text using pdf-parse
      const parsedData = await PDFParser(fileBuffer);
      const parsedText = parsedData.text;

      // Perform OCR on the images
      const ocrText = await this.performOcrOnImages(imageBuffers);

      // Combine parsed text and OCR text
      const combinedText = `${parsedText}\n${ocrText}`;

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

  private async convertPdfToImages(pdfBuffer: Buffer): Promise<Buffer[]> {
    const imageBuffers = await pdf2img.convert(pdfBuffer);

    const bufferArray = imageBuffers.map((imageBuffer) =>
      Buffer.from(imageBuffer),
    );

    return bufferArray;
  }

  private async performOcrOnImages(imageBuffers: Buffer[]): Promise<string> {
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng+rus');
    await worker.initialize('eng+rus');

    const ocrTexts = [];
    for (const imageBuffer of imageBuffers) {
      const {
        data: { text },
      } = await worker.recognize(imageBuffer);
      ocrTexts.push(text);
    }

    await worker.terminate();

    return ocrTexts.join('\n');
  }
}
