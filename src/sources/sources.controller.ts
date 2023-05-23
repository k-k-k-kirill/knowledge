import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Delete,
  Logger,
} from '@nestjs/common';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  private readonly logger = new Logger(SourcesController.name);

  constructor(private readonly sourcesService: SourcesService) {}

  @Get(':sourceId')
  async getById(@Param('sourceId') sourceId: string) {
    try {
      const { data } = await this.sourcesService.getById(sourceId);

      return data[0];
    } catch (error) {
      this.logger.error(
        'Error getting source details: ' + error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Error getting source details');
    }
  }

  @Delete(':sourceId')
  async deleteById(@Param('sourceId') sourceId: string) {
    try {
      await this.sourcesService.deleteById(sourceId);
      return { message: 'Source deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting source: ' + error.message, error.stack);
      throw new InternalServerErrorException('Error deleting source');
    }
  }
}
