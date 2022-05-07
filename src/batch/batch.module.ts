import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { LevelModule } from '../level/level.module';
import { Speciality } from '../speciality/entities/speciality.entity';
import { Batches_has_many_specialities } from './entities/batches_has_many_specialities.entiity';

@Module({
  controllers: [BatchController],
  providers: [BatchService ] , 
  imports : [TypeOrmModule.forFeature([Batch , Speciality , Batches_has_many_specialities ]) ,
  LevelModule] , 
  exports : [BatchService ]
})
export class BatchModule {}
