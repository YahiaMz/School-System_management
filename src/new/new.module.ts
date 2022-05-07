import { Module } from '@nestjs/common';
import { NewService } from './new.service';
import { NewController } from './new.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { New } from './entities/new.entity';
import { Group } from 'src/group/entities/group.entity';
import { Teacher } from 'src/teacher/teacher.entity';

@Module({
  controllers: [NewController],
  providers: [NewService] ,
  imports : [TypeOrmModule.forFeature([New , Group , Teacher])]
})
export class NewModule {}
