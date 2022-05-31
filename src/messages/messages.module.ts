import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { BatchModule } from 'src/batch/batch.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { StudentModule } from 'src/student/student.module';
import { AdminModule } from 'src/admin/admin.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService] , 
  imports : [TypeOrmModule.forFeature([Message]) , BatchModule , TeacherModule ,StudentModule ,GroupModule,AdminModule]
})
export class MessagesModule {}
