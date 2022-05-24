import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { GroupService } from 'src/group/group.service';
import { GroupModule } from 'src/group/group.module';

@Module({
  controllers: [LevelController],
  providers: [LevelService] , 
  exports : [ LevelService], 
  imports : [TypeOrmModule.forFeature([Level]) , GroupModule ]
})
export class LevelModule {}
