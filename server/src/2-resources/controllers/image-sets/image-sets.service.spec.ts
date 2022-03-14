import { Test, TestingModule } from '@nestjs/testing';
import { ImageSetsService } from './image-sets.service';

describe('ImageSetsService', () => {
  let service: ImageSetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageSetsService],
    }).compile();

    service = module.get<ImageSetsService>(ImageSetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
