import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Speciality } from 'src/speciality/entities/speciality.entity';
import { BatchModule } from 'src/batch/batch.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  controllers: [SectionController],
  providers: [SectionService] , 
  imports : [TypeOrmModule.forFeature([Section , Speciality]) , BatchModule , GroupModule] , 
  exports : [SectionService]
})
export class SectionModule {}
