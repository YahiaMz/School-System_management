import { BadRequestException, HttpException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { LoginStudentDto } from './dtos/student-login.dto';
import * as brcypt from 'bcrypt';
import { CreateStudentDto } from './dtos/createStudent.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import path = require('path')
import { join } from 'path';
const fs = require('fs')
import { createWriteStream } from 'fs';
import {v4 as uuidv4} from 'uuid';
import { Group } from 'src/group/entities/group.entity';
import { GroupService } from 'src/group/group.service';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { LevelService } from 'src/level/level.service';
import { SectionService } from 'src/section/section.service';
import { SpecialityService } from 'src/speciality/speciality.service';
import { BatchService } from 'src/batch/batch.service';


@Injectable()
export class StudentService {

    constructor ( @InjectRepository(Student) private studentRep : Repository<Student> ,
                  private groupService : GroupService , 
                  private batchService : BatchService , 
                  private sectionService : SectionService , 
                  private speciality_Service : SpecialityService ,
    ) { }
    private salt : number = 9;


    async create( createStudentDto : CreateStudentDto ) { 

      let batch = await this.batchService.findBatchByIdOrThrow_Exp(createStudentDto.batch_Id);
      
     
      
      let speciality = null ;
      if (createStudentDto.speciality_Id) { 
         console.log(`testing if spec ${createStudentDto.speciality_Id} in batch  ${createStudentDto.batch_Id}`);
         speciality = await this.speciality_Service.findSpecialityByIdoOrThrowExp (createStudentDto.speciality_Id);

      if (speciality && !this.batchService.doesThisbatchHasThisSpeciality (batch.level , createStudentDto.speciality_Id)) { 
         throw new HttpException(My_Helper.FAILED_RESPONSE('speciality does not exist in this level') , 200);
      }   
      
   }
      let section = await this.sectionService.findSectionByIdOrThrowException(createStudentDto.section_Id);
      if(speciality) { 
         if (!this.sectionService.doesThisSectionExistInThisSpeciality(createStudentDto.section_Id , speciality)){
            throw new HttpException(My_Helper.FAILED_RESPONSE('this section does not exist in this speciality') , 200);
         }
      } else { 
         let batchHasSection = await this.sectionService.doesThisSectionExistInThisBatch(createStudentDto.section_Id , batch);
         if(!batchHasSection) { 
            throw new HttpException(My_Helper.FAILED_RESPONSE('this section does not exist in this batch') , 200); 
         }
      }

      let group = await this.groupService.findGroupByIdOrThrowExp(createStudentDto.group_Id);
      if (group.section.id != section.id) {
         throw new HttpException(My_Helper.FAILED_RESPONSE('this group does not exist in this section') , 200); 
      }

      
     try {
       let HashedPassword = await brcypt.hash(createStudentDto.password , this.salt);
       delete createStudentDto.password;

              
       
       let student = await this.studentRep.create({
          name : createStudentDto.name , 
          lastName : createStudentDto.lastName , 
          email : createStudentDto.email , 
          password : createStudentDto.password , 
          dateOfBirth : createStudentDto.dateOfBirth , 
          batch : batch , 
          wilaya : createStudentDto.wilaya ,
          speciality : speciality , 
          section : section , 
          group : group,
       });
       student.password = HashedPassword;
       student.group = group;
      
        await this.studentRep.save(student);
        
        delete student.password;
        return student;

     } catch (error) {
       
      throw (new HttpException({ success : false , 
      message : 'Email Exist' } , 201))

     }
    
    }



     async findStudentById ( idStudent : number ) {

        if (isNaN(idStudent)) {
          throw (( new HttpException({ 
            success : false , 
            message : 'Id must be an integer !'
        } , 201)));
        }

        let student;
        try { 
           student = await this.studentRep.findOne({ id : idStudent} , {relations:['group']});
        }catch (e) {
             throw ( new HttpException( { success : false , 
            statusCode : 201 , 
            message : 'Something wrong !'
        } , 201))
         }


         if (!student)  throw (( new HttpException({ 
          success : false , 
          message : 'Student not found '
      } , 201)));

         return student;

    }


    async   findStudentByIdOrThrowException ( idStudent : number ) {

      if (isNaN(idStudent)) {
        throw (( new HttpException({ 
          success : false , 
          message : 'Id must be an integer !'
      } , 201)));
      }

      let student;
      try { 
         student = await this.studentRep.findOne({ id : idStudent });
      }catch (e) {
           throw ( new HttpException( { success : false , 
          statusCode : 201 , 
          message : 'Something wrong !'
      } , 201))
       }


       if (!student)  throw (( new HttpException({ 
        success : false , 
        message : 'Student not found '
    } , 201)));

       return student;

  }

  async   findStudentAndHimGroupByIdOrThrowException ( idStudent : number ) {

   let student;
   try { 
      student = await this.studentRep.findOne({ where : { id : idStudent } , relations : ['group'] });
   }catch (e) {
        throw ( new HttpException( { success : false , 
       statusCode : 201 , 
       message : 'Something wrong !'
   } , 201))
    }


    if (!student)  throw (( new HttpException({ 
     success : false , 
     message : 'Student not found '
 } , 201)));

    return student;

}





async studentLogin( loginStudentDto : LoginStudentDto ) { 

    let student;
    try { 
         student = await this.studentRep.findOne( { where : {email : loginStudentDto.email} , relations : ['group' , 'section' , 'batch' ,'speciality']} );
       } catch (e) {
         console.log(e.message)
         throw (( new HttpException({ 
          success : false , 
          message : 'Wrong email or password'
      } , 201)) );

       }

    if ( !student || !await brcypt.compare(loginStudentDto.password , student.password) )
    throw (( new HttpException({ 
      success : false , 
      message : 'Wrong email or password'
  } , 201)));
    
  delete student.password;
  let batchWithLevel = await this.batchService.findBatchAndItCurrentLevelByIdOrThrowException(student.batch.id);
  delete student.batch ;
  student ['batch'] = batchWithLevel;

  return student;
}





async updateStudent( id : number, updateStudent : UpdateStudentDto ) {
     let student = await this.findStudentById(id);
     if(updateStudent.group_Id) {
         let group = await this.groupService.findGroupByIdOrThrowExp(updateStudent.group_Id);
         student.group = group;
     }
     if(updateStudent.section_Id) { 
        let section = await this.sectionService.findSectionByIdOrThrowException(updateStudent.section_Id);
        student.section = section;
      }

     if (updateStudent.password) {
         let hashedPassword = await brcypt.hash(updateStudent.password , this.salt);
         updateStudent.password = hashedPassword;
        }

     Object.assign(student , updateStudent);

     let savedStudent;

         try { 
            savedStudent = await this.studentRep.save(student);
            delete savedStudent.password;
            return savedStudent;
         }catch ( e ) { 
            throw (new HttpException({ success:false , 
            message : 'cant update , this email exist !'
            } , 201))

         }

}


  async allStudents( ) { 
     let students = await this.studentRep.find({select : [
      'id' , 
      'name' ,
      'lastName' , 
      'dateOfBirth' ,
      'email' ,
      'wilaya',
      'profileImage' ,
      'created_at'  ,
      'updated_at' 
   ] , relations : ['group' , "section"]});

 return students;
    }


async deleteStudent(id : number) {


  let student = await this.findStudentById(id);

 
  if (student.profileImage) { 
  
  const path =My_Helper.studentImagesPath+student.profileImage ;

  try {
   await fs.unlinkSync(path)
  } catch(err) {
   await this.studentRep.remove(student);
   throw new HttpException(My_Helper.FAILED_RESPONSE(' student removed , but something wrong happen while removing the profile image' ), 201);
    }
  
}
  await this.studentRep.remove(student);
 }



 async getAllStudentOfSpec(  spec_Id : number ) {
   
   try {
      let studentsOfSpeciality = await this.studentRep.query(`
      SELECT * FROM student where student.speciality_Id = ${spec_Id}`);
      return studentsOfSpeciality;
   } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong while fetching students of this speciality ' ), 201); 
   }
   

   }

 



async getProfileImage( @Res()  res , profileImage : string){
 
   try {
      let file = await res.sendFile(join(process.cwd() , My_Helper.studentImagesPath+'/'+profileImage));         
      return file;
   } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('image not found') , 201);   
   }
   
}

async updateProfileImage ( student_Id : number , file : Express.Multer.File ) { 
   let student = await this.findStudentById(student_Id);
   if  ( !file || ! My_Helper.is_Image(file.mimetype) ) { 
      throw new HttpException( My_Helper.FAILED_RESPONSE("image must be a {.png, .jpeg, .jpg } ") , 201)
   };

   let filePath;

   if ( !student.profileImage ) { 
       let imageName = 'student'+uuidv4() + My_Helper.fileExtinction(file.mimetype);
        filePath = My_Helper.studentImagesPath + imageName;
       student.profileImage = imageName;
   } else { 
       filePath = My_Helper.studentImagesPath + student.profileImage;
   }

   let streamWriter = createWriteStream(filePath);
   streamWriter.write(file.buffer);

   student = await this.studentRep.save(student);
   delete student.password;
 return student;
 }



}
