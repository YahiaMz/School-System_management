import { Module } from '@nestjs/common';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './entities/mark.entity';
import { ModuleModule } from 'src/module/module.module';
import { StudentModule } from 'src/student/student.module';
import { CurrentSemesterModule } from 'src/current-semester/current-semester.module';

@Module({
  controllers: [MarksController],
  providers: [MarksService] , 
  imports : [TypeOrmModule.forFeature([Mark]) , ModuleModule,StudentModule , CurrentSemesterModule]
})
export class MarksModule {}
