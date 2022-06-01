import { Test, TestingModule } from '@nestjs/testing';
import { ChapterFileService } from './chapter-file.service';

describe('ChapterFileService', () => {
  let service: ChapterFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapterFileService],
    }).compile();

    service = module.get<ChapterFileService>(ChapterFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
