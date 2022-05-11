import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminDto } from 'src/admin/dtos/update-admin.dto';
import { GroupService } from 'src/group/group.service';
import { ModuleService } from 'src/module/module.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { SaleService } from 'src/sale/sale.service';
import { SectionService } from 'src/section/section.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { TimetableService } from 'src/timetable/timetable.service';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonService {

  constructor( @InjectRepository(Lesson) private lessonRepository : Repository<Lesson> , 
                private saleService : SaleService , 
                private groupService : GroupService , 
                private teacherService : TeacherService , 
                private sectionService : SectionService , 
                private moduleService : ModuleService
  ) { }


  async create(createLessonDto: CreateLessonDto) {
let section = await this.sectionService.findSectionByIdOrThrowException(createLessonDto.section_Id)
let sale = await this.saleService.findSaleByIdOrThrowExp(createLessonDto.sale_Id);
let teacher = await this.teacherService.findTeacherByIdOrThrowExp(createLessonDto.teacher_Id);
let mModule = await this.moduleService.findModuleByIdOrThrow_Exp(createLessonDto.module_Id);

let group = null;
try {
   group = await this.groupService.findGroupByIdOrThrowExp(createLessonDto.group_Id);
} catch (error) {
  
}

try {
  let lesson = await this.lessonRepository.create({
    day : createLessonDto.day , 
    lesson_Type : createLessonDto.lesson_Type , 
    startingTime : createLessonDto.startingTime , 
    endingTime : createLessonDto.endingTime , 
  });
  lesson.sale = sale;
  lesson.teacher = teacher;
  lesson.group = group;
  lesson.module = mModule;
 lesson.section = section;

  let newLesson = await this.lessonRepository.save(lesson);
  return newLesson;
  } catch (error) {
    console.log(error.message);
    
  throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ! , { '+error.message+' }') , 201);
}

  }

async  findAll_LessonsOfSection( section_Id  : number ) {
let section = await this.sectionService.findSectionByIdOrThrowException(section_Id);
 try {
   let lessons = await this.lessonRepository.find({ 
     where : {
       section : section 
     }, 
     relations : ['teacher' , 'group' , 'sale' , 'module' ]
   })
 
   return lessons;
 } catch (error) {
  throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);

 }

  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  public async findLessonByIdOrThrowExp( id : number) {
    try {
      let lesson = await this.lessonRepository.findOne({where : {
        id  : id 
      }})
      if(lesson) return lesson;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
    }

    throw new HttpException(My_Helper.FAILED_RESPONSE('lesson not found') , 201);
  }

async update(id: number, updateLessonDto: UpdateLessonDto) {
    let lesson = await this.findLessonByIdOrThrowExp(id);
    if ( updateLessonDto.section_Id ){
    let section = await this.sectionService.findSectionByIdOrThrowException(updateLessonDto.section_Id)
    lesson.section = section;
  }
    
  if (updateLessonDto.sale_Id) {
      let sale = await this.saleService.findSaleByIdOrThrowExp(updateLessonDto.sale_Id);
      lesson.sale = sale;
  }

  if (updateLessonDto.teacher_Id) {
    let teacher = await this.teacherService.findTeacherByIdOrThrowExp(updateLessonDto.teacher_Id);
    lesson.teacher = teacher;
  }

  if (updateLessonDto.module_Id) {
    let mModule = await this.moduleService.findModuleByIdOrThrow_Exp(updateLessonDto.module_Id);
    lesson.module = mModule;
  }

  if (updateLessonDto.group_Id) {
  let group = await this.groupService.findGroupByIdOrThrowExp(updateLessonDto.group_Id);
  lesson.group = group;
  }


 Object.assign(lesson , updateLessonDto);
 return await this.lessonRepository.save(lesson);

  }

 async remove(id: number) {
    let lesson = await this.findLessonByIdOrThrowExp(id)
    try {
      return await this.lessonRepository.remove(lesson);
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
    }
 
  }


  async teacherTimeTable(teacher_Id : number) {
    let teacher = await this.teacherService.findTeacherByIdOrThrowExp(teacher_Id);
 try {
     let teacherLessons = await this.lessonRepository.query(`SELECT * FROM lesson where lesson.teacher_Id =${teacher_Id}`);
     for ( let x = 0 ; x < teacherLessons.length ; x ++) { 
        let sale = await this.saleService.findSaleByIdOrThrowExp(teacherLessons[x].sale_Id);
        delete teacherLessons[x].sale_Id;
         
        let group = await this.groupService.findGroupByIdOrThrowExp(teacherLessons[x].teacher_Id);
        delete teacherLessons[x].group_Id;

        let mModule = await this.moduleService.findModuleByIdOrThrow_Exp(teacherLessons[x].module_Id);
        delete teacherLessons[x].module_Id;
        delete teacherLessons[x].teacher_Id;

        teacherLessons[x]['sale'] = sale;
        teacherLessons[x]['group'] = group;
        teacherLessons[x]['module'] = mModule;
      

      }

      
      return teacherLessons;

 } catch (error) {
     throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
 }

}




}
