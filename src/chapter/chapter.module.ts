import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { BatchModule } from 'src/batch/batch.module';
import { ModuleModule } from 'src/module/module.module';
import { ChapterFile } from 'src/chapter-file/entities/chapter-file.entity';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService] ,
  imports : [TypeOrmModule.forFeature([Chapter , ChapterFile]) , BatchModule , ModuleModule] , 
  exports : [ChapterService]
})
export class ChapterModule {}
