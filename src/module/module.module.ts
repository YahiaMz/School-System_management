import { Module } from '@nestjs/common';
import { Module as ModuleEntity } from './module.entity';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from 'src/level/entities/level.entity';
import { SpecialityModule } from 'src/speciality/speciality.module';
import { CurrentSemesterModule } from 'src/current-semester/current-semester.module';

@Module({
  providers: [ModuleService],
  controllers: [ModuleController] ,
  imports : [TypeOrmModule.forFeature([ModuleEntity , Level]) , SpecialityModule , CurrentSemesterModule] , 
  exports : [ModuleService]
})
export class ModuleModule {}
