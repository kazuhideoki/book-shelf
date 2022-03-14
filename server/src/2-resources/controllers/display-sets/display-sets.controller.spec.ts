import { Test, TestingModule } from '@nestjs/testing';
import { DisplaySetsController } from './display-sets.controller';
import { DisplaySetsService } from './display-sets.service';

describe('DisplaySetsController', () => {
  let controller: DisplaySetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisplaySetsController],
      providers: [DisplaySetsService],
    }).compile();

    controller = module.get<DisplaySetsController>(DisplaySetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
