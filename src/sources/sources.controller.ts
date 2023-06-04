import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Delete,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SourcesService } from './sources.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('sources')
export class SourcesController {
  private readonly logger = new Logger(SourcesController.name);

  constructor(private readonly sourcesService: SourcesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':sourceId')
  async getById(@Request() req, @Param('sourceId') sourceId: string) {
    try {
      const { data } = await this.sourcesService.getById(
        sourceId,
        req.user.userId,
      );

      return data[0];
    } catch (error) {
      this.logger.error(
        'Error getting source details: ' + error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Error getting source details');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sourceId')
  async deleteById(@Request() req, @Param('sourceId') sourceId: string) {
    try {
      await this.sourcesService.deleteById(sourceId, req.user.userId);
      return { message: 'Source deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting source: ' + error.message, error.stack);
      throw new InternalServerErrorException('Error deleting source');
    }
  }
}
