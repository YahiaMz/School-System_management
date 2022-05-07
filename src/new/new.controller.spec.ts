import { Test, TestingModule } from '@nestjs/testing';
import { NewController } from './new.controller';
import { NewService } from './new.service';

describe('NewController', () => {
  let controller: NewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewController],
      providers: [NewService],
    }).compile();

    controller = module.get<NewController>(NewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
