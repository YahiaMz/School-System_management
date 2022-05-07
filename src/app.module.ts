import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/admin.entity';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from './batch/batch.module';
import { Batch } from './batch/entities/batch.entity';
import { ChapterModule } from './chapter/chapter.module';
import { Chapter } from './chapter/entities/chapter.entity';
import { Group } from './group/entities/group.entity';
import { GroupModule } from './group/group.module';
import { Lesson } from './lesson/entities/lesson.entity';
import { LessonModule } from './lesson/lesson.module';
import { Level } from './level/entities/level.entity';
import { LevelModule } from './level/level.module';
import { ModuleModule } from './module/module.module';
import { Student } from './module/student.entity';
import { New } from './new/entities/new.entity';
import { NewModule } from './new/new.module';
import { Sale } from './sale/entities/sale.entity';
import { SaleModule } from './sale/sale.module';
import { SectionModule } from './section/section.module';
import { Speciality } from './speciality/entities/speciality.entity';
import { SpecialityHasManyMoudules } from './speciality/entities/specialityHasManyModule.entity';
import { SpecialityModule } from './speciality/speciality.module';
import { StudentModule } from './student/student.module';
import { Teacher } from './teacher/teacher.entity';
import { TeacherModule } from './teacher/teacher.module';
import { Timetable } from './timetable/entities/timetable.entity';
import {Module as ModuleEntity} from './module/module.entity';




const localhost = {
 type: 'mysql',
host: 'localhost',
port: 3306,
username : 'Yahia',
password : '12345;',
database: '1cs-project-db'
};


const railwayDb = {
    type: 'mysql',
    host: 'containers-us-west-37.railway.app',
    port: 7426,
    username : 'root',
    password : 'DmdOWCQPIhrhtSknRbgn',
    database: 'railway',
    
};


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'containers-us-west-37.railway.app',
    port: 7426,
    username : 'root',
    password : 'DmdOWCQPIhrhtSknRbgn',
    database: 'railway',

    entities: [
      Teacher , Admin , ModuleEntity , 
      Student  , Batch , Level , Speciality , 
      Group , SpecialityHasManyMoudules ,
      New , Chapter , Timetable ,
       Lesson , Sale
    ],
    synchronize: true,
    autoLoadEntities : true 

  }),

  TeacherModule, AdminModule, StudentModule, ModuleModule ,
  BatchModule,
  LevelModule,
  SpecialityModule,
  GroupModule,
  SectionModule,
  NewModule,
  ChapterModule,
  SaleModule,  
  LessonModule , 

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
