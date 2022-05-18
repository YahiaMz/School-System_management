import { Module as ModuleEntity } from '../module/module.entity';
import { Module } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { SpecialityController } from './speciality.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from './entities/speciality.entity';
import { Batch } from 'src/batch/entities/batch.entity';
import { LevelModule } from 'src/level/level.module';

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService] , 
  imports : [TypeOrmModule.forFeature([Speciality , Batch , ModuleEntity  , 
  ]) , LevelModule] , 
  exports : [SpecialityService]
})
export class SpecialityModule {}
