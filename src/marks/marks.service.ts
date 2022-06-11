import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentSemesterService } from 'src/current-semester/current-semester.service';
import { Module } from 'src/module/module.entity';
import { ModuleService } from 'src/module/module.service';
import { Student } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { Repository } from 'typeorm';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { Mark } from './entities/mark.entity';

@Injectable()
export class MarksService {

  constructor( @InjectRepository(Mark) private markRepository : Repository<Mark> , 
               private studentService : StudentService ,
               private moduleService : ModuleService , 
               private currentSemesterService : CurrentSemesterService
  ) {
    
  }


  private async findStudentMarkRowInModule( oStudent : Student , oModule : Module , current_semester : number) {
  
  

    try {
      let markRow = await this.markRepository.findOne({
         where : { student : oStudent , module : oModule , semester : current_semester  }
       , relations : ['module']
      });
      if(markRow) {
        return markRow ;
      }   

    } catch (error) {

      throw new HttpException( 
      { success : false , 
          message : 'something wrong', 
          error_message : error.message
       }, 201
       
       );  
    
        }

        return false;
   } 


   private async createMarkRow (createMarkDto : CreateMarkDto , student : Student ,mModule : Module  , currentSemester : number ) {
    


    let atLeastOneMark = createMarkDto.cc || createMarkDto.emd1 || createMarkDto.emd1; 
    if( !atLeastOneMark ) {
      throw new HttpException( 
        { success : false , 
            message : 'to put mark you have to enter at lease cc or emd1 or emd2', 
         }, 201);
     };

    try {
     let newMarkRow = this.markRepository.create({
      student : student , 
      module : mModule , 
      emd1 : createMarkDto.emd1 , 
      cc : createMarkDto.cc , 
      emd2 : createMarkDto.emd2 , 
      semester : currentSemester
     }) ;

     return await this.markRepository.save(newMarkRow);

    } catch (error) {




            throw new HttpException( 
       { success : false , 
      message : error.message, 
      error_message : error.message
    } ,
        201);
    };


   }



  async putMarks(createMarkDto: CreateMarkDto) {
    let student = await this.studentService.findStudentByIdOrThrowException(createMarkDto.student_Id) ;


    let currentSemester = await this.currentSemesterService.getCurrentSemester();
    let mModule = await  this.moduleService.findModuleByIdOrThrow_Exp(createMarkDto.module_Id);
    console.log(`{ current Semester ${currentSemester.current_semester} module Semester = ${mModule.semester}}`);
    
    if (mModule.semester != currentSemester.current_semester) {
      throw new HttpException( 
        { success : false , 
       message : 'module semester != current semester', 
     } ,
         201);  
    }

 let markRowOfThisStudent = await this.findStudentMarkRowInModule(student , mModule ,currentSemester.current_semester );


  if (markRowOfThisStudent) {

      if(createMarkDto.cc) {
        markRowOfThisStudent.cc = createMarkDto.cc;
      } 
      if(createMarkDto.emd1) {
      markRowOfThisStudent.emd1 = createMarkDto.emd1;
      }
      if(createMarkDto.emd2) {
        markRowOfThisStudent.emd2 = createMarkDto.emd2;
      }


      let updateMarkRow = await this.markRepository.save(markRowOfThisStudent);
      if(markRowOfThisStudent.cc && markRowOfThisStudent.emd1 && markRowOfThisStudent.emd2) {
        markRowOfThisStudent['canShowAvg'] = true;
        markRowOfThisStudent['avg'] = markRowOfThisStudent.emd1 * .5 + markRowOfThisStudent.emd1 *.25 + markRowOfThisStudent.emd2 * .25
      } else 
      {
        markRowOfThisStudent['canShowAvg'] = false;

      }
      return updateMarkRow;


  }else {
    try {      
      return await this.createMarkRow(createMarkDto , student , mModule , currentSemester.current_semester);
    } catch (error) {


      throw new HttpException( 
        { success : false , 
       message : 'something wrong', 
       error_message : error.message
     } ,
         201);
      
    }
  }


  }

  async findAll(student_Id : number , semester : number ) {
    let student = await this.studentService.findStudentByIdOrThrowException(student_Id) ;

    try {
       let marks = await this.markRepository.find({where : {
         student : student ,
         semester : semester }  , 
        relations : ['module']
        })

        for (let x = 0 ; x<marks.length ; x++) {
          if(marks[x].cc && marks[x].emd1 && marks[x].emd2) {
            marks[x]['canShowAvg'] = true;
            marks[x]['avg'] = marks[x].emd1 * .5 + marks[x].emd1 *.25 + marks[x].emd2 * .25
          } else 
          {
            marks[x]['canShowAvg'] = false;

          }
        }

      return marks;

      } catch (error) {
            throw new HttpException( 
       { success : false , 
      message : 'something wrong', 
      error_message : error.message
    } ,
        201);
    };

  }








 async findMarksOfGroup(id: number , module_Id : number) {

  let current_semester = await this.currentSemesterService.getCurrentSemester();

  try {

    let marksOfGroup = await this.markRepository.query(`
  SELECT s.id as 'student_Id' , s.name , s.lastName , s.profileImage ,
   m.emd1 , m.emd2 , m.cc , m.semester  , !( m.cc is null or m.emd1 is null or m.emd2 is null ) as 'canShowAvg' 
  FROM student s left join mark m on s.id = m.student_Id inner join \`group\` g on s.group_Id = g.id
  where g.id = ${id} and m.id = ${module_Id}
    ` 
  );

   return marksOfGroup;
  
  }   
   catch (error) {
    throw new HttpException( 
      { success : false , 
     message : 'something wrong', 
     error_message : error.message
   } ,
       201);
  }

}
  update(id: number, updateMarkDto: UpdateMarkDto) {
    return `This action updates a #${id} mark`;
  }

  remove(id: number) {
    return `This action removes a #${id} mark`;
  }
}
