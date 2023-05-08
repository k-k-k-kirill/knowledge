import { Test, TestingModule } from '@nestjs/testing';
import { TextSectionsService } from './text-sections.service';

describe('TextSectionsService', () => {
  let service: TextSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextSectionsService],
    }).compile();

    service = module.get<TextSectionsService>(TextSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
