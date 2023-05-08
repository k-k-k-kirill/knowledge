import { Test, TestingModule } from '@nestjs/testing';
import { TextSectionsController } from './text-sections.controller';

describe('TextSectionsController', () => {
  let controller: TextSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextSectionsController],
    }).compile();

    controller = module.get<TextSectionsController>(TextSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
