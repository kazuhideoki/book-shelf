import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from '../../../global.module';
import { ImageSetsController } from './image-sets.controller';
import { ImageSetsModule } from './image-sets.module';

describe('ImageSetsController', () => {
  let controller: ImageSetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImageSetsModule, GlobalModule],
    }).compile();

    controller = module.get<ImageSetsController>(ImageSetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
