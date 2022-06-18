import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentSemesterService } from 'src/current-semester/current-semester.service';
import { GroupService } from 'src/group/group.service';
import { ModuleService } from 'src/module/module.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { SaleService } from 'src/sale/sale.service';
import { SectionService } from 'src/section/section.service';
import { TeacherService } from 'src/teacher/teacher.service';
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
                private moduleService : ModuleService , 
                private currentSemeseterService : CurrentSemesterService
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
    let errMessage =  "oops something wrong !"
  
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ! , { '+error.message+' }') , 201);
}

  }

async  findAll_LessonsOfSection( section_Id  : number , semester : number) {
  console.log(section_Id);
  
let section = await this.sectionService.findSectionByIdOrThrowException(section_Id);
 try {
   let lessonsOfSunday = await this.lessonRepository.find({ 
     where : {
       section : section ,
       day : 1 ,
       semester : semester
     },  
     order : {
      startingTime : 'ASC'
     } ,
     relations : ['teacher' , 'group' , 'sale' , 'module' ]
   })
  

   let lessonsOfMonday = await this.lessonRepository.find({ 
    where : {
      section : section ,
      day : 2,
      semester : semester

    }, 
    order : {
      startingTime : 'ASC'
   } ,
  
    relations : ['teacher' , 'group' , 'sale' , 'module' ]
  })

  let lessonsOfTuesDay = await this.lessonRepository.find({ 
    where : {
      section : section ,
      day : 3 ,
      semester : semester

    }, 
    order : {
      startingTime : 'ASC'
   } ,
  
    relations : ['teacher' , 'group' , 'sale' , 'module' ]
  })

  let lessonsOfWednesday = await this.lessonRepository.find({ 
    where : {
      section : section ,
      day : 4 ,
      semester : semester

    }, 
    order : {
      startingTime : 'ASC'
   } ,
  
    relations : ['teacher' , 'group' , 'sale' , 'module' ]
  })


  let lessonsOfThursDay = await this.lessonRepository.find({ 
    where : {
      section : section ,
      day : 5 ,
      semester : semester
    }, 
    order : {
      startingTime : 'ASC'
   } ,
  
    relations : ['teacher' , 'group' , 'sale' , 'module' ]
  })


  let lessons = {
    "sunday" : lessonsOfSunday ,
    "monday" : lessonsOfMonday ,
    "tuesday" : lessonsOfTuesDay,
    "wednesday" : lessonsOfWednesday,
    "thursday" : lessonsOfThursDay
  }

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
 try {
  return await this.lessonRepository.save(lesson);
 } catch (error) {
  throw new HttpException(My_Helper.FAILED_RESPONSE(`something wrong : ${error.message}`) , 201);
 }

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
     let teacherLessons = await this.lessonRepository.query(`SELECT * FROM lesson where lesson.teacher_Id = ${teacher_Id} order by lesson.startingTime `);
     
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


async teacherSchedule(teacher_Id : number) {
  let currentSemester = await this.currentSemeseterService.getCurrentSemester();
  let teacher = await this.teacherService.findTeacherByIdOrThrowExp(teacher_Id);
try {
   let teacherLessons = await this.lessonRepository.find({select : [ 'id','day' ,'startingTime','semester', 'endingTime' , 'lesson_Type' ,] ,where : {teacher : teacher , semester : currentSemester.current_semester} , relations : ['teacher', "module",'group', "sale" ] , order : {startingTime:'ASC'}} );
   
   let sunday = teacherLessons.filter(({day}) => day == 1);
   let monday = teacherLessons.filter(({day}) => day == 2);
   let tuesday = teacherLessons.filter(({day}) => day == 3);
   let wednesday = teacherLessons.filter(({day}) => day == 4);
   let thursday = teacherLessons.filter(({day}) => day == 5);


    
    return {
      'sunday' : sunday , 
      "monday" : monday , 
      "tuesday" : tuesday , 
      "wednesday" : wednesday , 
      "thursday" : thursday
    };

} catch (error) {
   throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
}


}


async groupSchedule(group_Id : number) {
  let currentSemester = await this.currentSemeseterService.getCurrentSemester();
  let group = await this.groupService.findJustTheGroupByIdOrThrowExp(group_Id);
try {
   let teacherLessons = await this.lessonRepository.find({select : [ 'id','day' ,'startingTime','semester', 'endingTime' , 'lesson_Type' ,] ,where : {group : group , semester : currentSemester.current_semester} , relations : ['teacher', "module",'group', "sale" ] , order : {startingTime:'ASC'}} );
   
   let sunday = teacherLessons.filter(({day}) => day == 1);
   let monday = teacherLessons.filter(({day}) => day == 2);
   let tuesday = teacherLessons.filter(({day}) => day == 3);
   let wednesday = teacherLessons.filter(({day}) => day == 4);
   let thursday = teacherLessons.filter(({day}) => day == 5);
    
    return {
      'sunday' : sunday , 
      "monday" : monday , 
      "tuesday" : tuesday , 
      "wednesday" : wednesday , 
      "thursday" : thursday
    };

} catch (error) {
   throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
}


}


async currentLectures( ) {

  
  let currentSemester = await this.currentSemeseterService.getCurrentSemester();
  

  let cDate = new Date();
let cTime = this.getRightForm(cDate.getHours()) + ":"+cDate.getMinutes();
  //let cTime = this.getRightForm(8) + ":"+cDate.getMinutes();


try {
   let currentLectures = await this.lessonRepository.find({select : [ 'id','day' ,'startingTime','semester', 'endingTime' , 'lesson_Type' ,] ,where : { semester : currentSemester.current_semester , day :cDate.getDay() } , relations : ['teacher', "module",'group', "sale" ] , order : {startingTime:'ASC'}} );
   
   return currentLectures.filter(e => e.startingTime < cTime && e.endingTime > cTime);

} catch (error) {
   throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
}


}


private getRightForm ( time : number  ){
  return (time < 10)? '0'+time : time;
}


async groupScheduleWithCours(group_Id : number) {
  let currentSemester = await this.currentSemeseterService.getCurrentSemester();
  let group = await this.groupService.findJustTheGroupByIdOrThrowExp(group_Id);
try {
   let teacherLessons = await this.lessonRepository.find({select : [ 'id','day' ,'startingTime','semester', 'endingTime' , 'lesson_Type' ,] ,where : {group : group , semester : currentSemester.current_semester} , relations : ['teacher', "module",'group', "sale" ] , order : {startingTime:'ASC'}} );
   
   let sunday = teacherLessons.filter(({day}) => day == 1);
   let monday = teacherLessons.filter(({day}) => day == 2);
   let tuesday = teacherLessons.filter(({day}) => day == 3);
   let wednesday = teacherLessons.filter(({day}) => day == 4);
   let thursday = teacherLessons.filter(({day}) => day == 5);
    
    return {
      'sunday' : sunday , 
      "monday" : monday , 
      "tuesday" : tuesday , 
      "wednesday" : wednesday , 
      "thursday" : thursday
    };

} catch (error) {
   throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
}


}






}
