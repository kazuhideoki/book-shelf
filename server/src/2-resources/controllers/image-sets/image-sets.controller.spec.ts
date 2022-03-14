import { Test, TestingModule } from '@nestjs/testing';
import { ImageSetsController } from './image-sets.controller';
import { ImageSetsService } from './image-sets.service';

describe('ImageSetsController', () => {
  let controller: ImageSetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageSetsController],
      providers: [ImageSetsService],
    }).compile();

    controller = module.get<ImageSetsController>(ImageSetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
