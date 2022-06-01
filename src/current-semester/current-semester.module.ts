import { Module } from '@nestjs/common';
import { CurrentSemesterService } from './current-semester.service';
import { CurrentSemesterController } from './current-semester.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentSemester } from './entities/current-semester.entity';

@Module({
  controllers: [CurrentSemesterController],
  providers: [CurrentSemesterService] , 
  imports : [TypeOrmModule.forFeature([CurrentSemester])] , 
  exports : [CurrentSemesterService]
})
export class CurrentSemesterModule {}
