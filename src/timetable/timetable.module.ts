import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/section/entities/section.entity';
import { Timetable } from './entities/timetable.entity';
import { SectionModule } from 'src/section/section.module';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService]  , 
  imports : [TypeOrmModule.forFeature([Timetable]) , SectionModule]  , 
  exports : [TimetableService]
})
export class TimetableModule {}
