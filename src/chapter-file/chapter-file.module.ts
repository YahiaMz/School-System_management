import { Module } from '@nestjs/common';
import { ChapterFileService } from './chapter-file.service';
import { ChapterFileController } from './chapter-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterFile } from './entities/chapter-file.entity';
import { ChapterModule } from 'src/chapter/chapter.module';

@Module({
  controllers: [ChapterFileController],
  providers: [ChapterFileService] , 
  imports : [TypeOrmModule.forFeature([ChapterFile]) , ChapterModule]
})
export class ChapterFileModule {}
