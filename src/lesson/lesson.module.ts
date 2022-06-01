import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { SaleModule } from 'src/sale/sale.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { GroupModule } from 'src/group/group.module';
import { ModuleModule } from 'src/module/module.module';
import { SectionService } from 'src/section/section.service';
import { SectionModule } from 'src/section/section.module';
import { CurrentSemesterModule } from 'src/current-semester/current-semester.module';

@Module({
  controllers: [LessonController],
  providers: [LessonService] , 
  imports : [TypeOrmModule.forFeature([Lesson] ) , 
  SaleModule , 
  TeacherModule , 
  GroupModule , 
  SectionModule ,
  ModuleModule , 
  CurrentSemesterModule
]
})
export class LessonModule {}
