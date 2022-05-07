import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Section } from 'src/section/entities/section.entity';

@Module({
  controllers: [GroupController],
  providers: [GroupService] , 
  imports : [TypeOrmModule.forFeature([Group , Section])] , 
  exports : [GroupService]
})
export class GroupModule {}
