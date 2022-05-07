import { Test, TestingModule } from '@nestjs/testing';
import { NewService } from './new.service';

describe('NewService', () => {
  let service: NewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewService],
    }).compile();

    service = module.get<NewService>(NewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
