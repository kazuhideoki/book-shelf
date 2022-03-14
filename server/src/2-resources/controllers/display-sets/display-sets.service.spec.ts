import { Test, TestingModule } from '@nestjs/testing';
import { DisplaySetsService } from './display-sets.service';

describe('DisplaySetsService', () => {
  let service: DisplaySetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisplaySetsService],
    }).compile();

    service = module.get<DisplaySetsService>(DisplaySetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
