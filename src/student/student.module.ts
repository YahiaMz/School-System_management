import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { GroupService } from 'src/group/group.service';
import { GroupModule } from 'src/group/group.module';
import { SectionModule } from 'src/section/section.module';
import { BatchModule } from 'src/batch/batch.module';
import { SpecialityModule } from 'src/speciality/speciality.module';

@Module({
  providers: [StudentService],
  controllers: [StudentController] , 
  imports : [TypeOrmModule.forFeature([Student]) , GroupModule , SectionModule , BatchModule , SpecialityModule  ] , 
  exports : [StudentService]
})
export class StudentModule {}
