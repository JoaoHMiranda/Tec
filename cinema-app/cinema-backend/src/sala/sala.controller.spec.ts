import { Test, TestingModule } from '@nestjs/testing';
import { SalaController } from './sala.controller';

describe('SalaController', () => {
  let controller: SalaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaController],
    }).compile();

    controller = module.get<SalaController>(SalaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
