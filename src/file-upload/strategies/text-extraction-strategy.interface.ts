export interface TextExtractionStrategy {
  extractText(fileBuffer: Buffer): Promise<string> | string;
}
