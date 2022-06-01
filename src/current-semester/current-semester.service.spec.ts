import { Test, TestingModule } from '@nestjs/testing';
import { CurrentSemesterService } from './current-semester.service';

describe('CurrentSemesterService', () => {
  let service: CurrentSemesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentSemesterService],
    }).compile();

    service = module.get<CurrentSemesterService>(CurrentSemesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
