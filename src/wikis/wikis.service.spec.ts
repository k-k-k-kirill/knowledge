import { Test, TestingModule } from '@nestjs/testing';
import { WikisService } from './wikis.service';

describe('WikisService', () => {
  let service: WikisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WikisService],
    }).compile();

    service = module.get<WikisService>(WikisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
