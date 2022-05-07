import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../module/student.entity';
import { GroupService } from 'src/group/group.service';
import { GroupModule } from 'src/group/group.module';

@Module({
  providers: [StudentService],
  controllers: [StudentController] , 
  imports : [TypeOrmModule.forFeature([Student]) , GroupModule ]
})
export class StudentModule {}
