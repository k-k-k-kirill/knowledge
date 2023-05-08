import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly supabaseService: SupabaseService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async processUploadedFile(
    file: Express.Multer.File,
    wikiId: string,
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
    };

    return this.processChunks(chunks, sourceData);
  }

  async processRemoteDownloadedFile(
    file: any,
    wikiId: string,
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
    };

    return this.processChunks(chunks, sourceData);
  }

  async getChunkedTextFromFile(file: any): Promise<string[]> {
    const text = await this.fileUploadService.extractTextFromBuffer(
      file.buffer,
      file.mimetype,
    );

    return getChunkedText(text, 1000);
  }

  async processUrl(url: string, wikiId: string) {
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
        // Use the same logic as in your file upload functionality
        await this.processTextFromURL(text, url, wikiId);
      } else {
        // Process the file content (e.g., create embeddings, text sections, etc.)
        // Use the same logic as in your file upload functionality
        const file = {
          buffer: response.data,
          mimetype: response.headers['content-type'],
          originalname: url.split('/').pop(),
        };
        await this.processRemoteDownloadedFile(file, wikiId);
      }
    } catch (error) {
      throw new Error('Error processing URL: ' + error.message);
    }
  }

  async processTextFromURL(text: string, url: string, wikiId: string) {
    const chunks = getChunkedText(text, 1000).filter(
      (chunk) => chunk.trim().length > 0,
    );

    const sourceData = {
      name: url,
      type: 'url',
      content_hash: getFileHash(Buffer.from(text)),
      wiki_id: wikiId,
    };

    return this.processChunks(chunks, sourceData);
  }

  async processChunks(chunks: string[], sourceData: CreateSourceDto) {
    for (const chunk of chunks) {
      await this.processChunk(chunk, sourceData);
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

  async processChunk(chunk: string, sourceData: CreateSourceDto) {
    const embedding = await this.createEmbedding(chunk);

    const textSectionData = {
      text: chunk,
      embedding,
      wiki_id: sourceData.wiki_id,
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
      throw new Error('Failed to create source and text section');
    }
  }
}
