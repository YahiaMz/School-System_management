import { Test, TestingModule } from '@nestjs/testing';
import { ChapterFileController } from './chapter-file.controller';
import { ChapterFileService } from './chapter-file.service';

describe('ChapterFileController', () => {
  let controller: ChapterFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterFileController],
      providers: [ChapterFileService],
    }).compile();

    controller = module.get<ChapterFileController>(ChapterFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
