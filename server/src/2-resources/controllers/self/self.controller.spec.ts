import { Test, TestingModule } from '@nestjs/testing';
import { SelfController } from './self.controller';
import { SelfService } from './self.service';

describe('SelfController', () => {
  let controller: SelfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelfController],
      providers: [SelfService],
    }).compile();

    controller = module.get<SelfController>(SelfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
