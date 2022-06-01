import { Test, TestingModule } from '@nestjs/testing';
import { CurrentSemesterController } from './current-semester.controller';
import { CurrentSemesterService } from './current-semester.service';

describe('CurrentSemesterController', () => {
  let controller: CurrentSemesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentSemesterController],
      providers: [CurrentSemesterService],
    }).compile();

    controller = module.get<CurrentSemesterController>(CurrentSemesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
