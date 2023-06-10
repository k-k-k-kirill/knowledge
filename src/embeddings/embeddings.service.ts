import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OpenAiService } from '../open-ai/open-ai.service';
import { CreateTextSectionDto } from '../text-sections/dto/create-text-section.dto';
import { CreateSourceDto } from '../sources/dto/create-source.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { getFileHash } from '../file-upload/utils';
import { getChunkedText } from './utils';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  constructor(
    private readonly openAiService: OpenAiService,
    private readonly supabaseService: SupabaseService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async processUploadedFiles(
    files: Express.Multer.File[],
    wikiId: string,
    userId: string,
  ): Promise<
    Array<{
      message: string;
      source: string;
      sections: { total: number; data: string[] };
    }>
  > {
    const results: Array<{
      message: string;
      source: string;
      sections: { total: number; data: string[] };
    }> = [];

    for (const file of files) {
      if (!file) {
        throw new BadRequestException('File not provided');
      }

      const result = await this.processUploadedFile(file, wikiId, userId);
      results.push(result);
    }

    return results;
  }

  async processUploadedFile(
    file: Express.Multer.File,
    wikiId: string,
    userId: string,
  ): Promise<{
    message: string;
    source: string;
    sections: { total: number; data: string[] };
  }> {
    const chunks = await this.getChunkedTextFromFile(file);

    const sourceData = {
      name: file.originalname,
      type: 'file',
      content_hash: getFileHash(file.buffer),
      wiki_id: wikiId,
      user_id: userId,
    };

    return this.processChunks(chunks, sourceData, userId);
  }

  async processRemoteDownloadedFile(
    file: any,
    wikiId: string,
    userId: string,
  ): Promise<{
    message: string;
    source: string;
    sections: { total: number; data: string[] };
  }> {
    const chunks = await this.getChunkedTextFromFile(file);

    const sourceData = {
      name: file.originalname,
      type: 'url',
      content_hash: getFileHash(file.buffer),
      wiki_id: wikiId,
      user_id: userId,
    };

    return this.processChunks(chunks, sourceData, userId);
  }

  async getChunkedTextFromFile(file: any): Promise<string[]> {
    const text = await this.fileUploadService.extractTextFromBuffer(
      file.buffer,
      file.mimetype,
    );

    return getChunkedText(text, 300);
  }

  async processUrl(url: string, wikiId: string, userId: string) {
    try {
      // Fetch the content from the URL
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // Check if the fetched content is an HTML page or a file
      if (response.headers['content-type'].startsWith('text/html')) {
        // Process the HTML content using Cheerio or another library
        const html = response.data.toString();
        const $ = cheerio.load(html);
        $('script, style', 'iframe').remove();

        const text = $('body').text();

        // Process the extracted text (e.g., create embeddings, text sections, etc.)
        await this.processTextFromURL(text, url, wikiId, userId);
      } else {
        // Process the file content (e.g., create embeddings, text sections, etc.)
        const file = {
          buffer: response.data,
          mimetype: response.headers['content-type'],
          originalname: url.split('/').pop(),
        };
        await this.processRemoteDownloadedFile(file, wikiId, userId);
      }
    } catch (error) {
      this.logger.error(`Error processing URL: ${error}`);
      throw new BadRequestException('Error processing URL');
    }
  }

  async processTextFromURL(
    text: string,
    url: string,
    wikiId: string,
    userId: string,
  ) {
    const chunks = getChunkedText(text, 300).filter(
      (chunk) => chunk.trim().length > 0,
    );

    const sourceData = {
      name: url,
      type: 'url',
      content_hash: getFileHash(Buffer.from(text)),
      wiki_id: wikiId,
      user_id: userId,
    };

    return this.processChunks(chunks, sourceData, userId);
  }

  async processChunks(
    chunks: string[],
    sourceData: CreateSourceDto,
    userId: string,
  ) {
    for (const chunk of chunks) {
      await this.processChunk(chunk, sourceData, userId);
    }

    return {
      message: 'Source processed successfully',
      source: sourceData.name,
      sections: {
        total: chunks.length,
        data: chunks,
      },
    };
  }

  async processChunk(
    chunk: string,
    sourceData: CreateSourceDto,
    userId: string,
  ) {
    const embedding = await this.createEmbedding(chunk);

    const textSectionData = {
      text: chunk,
      embedding,
      wiki_id: sourceData.wiki_id,
      user_id: userId,
    };

    await this.createSourceAndTextSection(sourceData, textSectionData);
  }

  async createEmbedding(text: string) {
    const embedding = await this.openAiService.createEmbedding(text);
    return embedding;
  }

  async createSourceAndTextSection(
    sourceData: CreateSourceDto,
    textSectionData: CreateTextSectionDto,
  ) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.rpc('create_source_and_text_section', {
      source_data: sourceData,
      text_section_data: textSectionData,
    });

    if (error) {
      console.log(error);
      this.logger.error(`Failed to create source and text section: ${error}`);
      throw new BadRequestException('Failed to create source and text section');
    }
  }

  async processText(
    text: string,
    wikiId: string,
    userId: string,
  ): Promise<{
    message: string;
    source: string;
    sections: { total: number; data: string[] };
  }> {
    const chunks = getChunkedText(text, 300).filter(
      (chunk) => chunk.trim().length > 0,
    );

    let sourceName = text.substring(0, 50);
    if (text.length > 50) {
      sourceName += '...';
    }

    const sourceData = {
      name: sourceName,
      type: 'text',
      content_hash: getFileHash(Buffer.from(text)),
      wiki_id: wikiId,
      user_id: userId,
    };

    return this.processChunks(chunks, sourceData, userId);
  }
}
