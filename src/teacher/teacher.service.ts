import { BadRequestException, HttpException, Injectable, NotFoundException, Res,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dtos/create-teacher-dto';
import { Teacher } from './teacher.entity';
import * as bcrypt from 'bcrypt'
import { LoginTeacherDto } from './dtos/teacher-login.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import {v4 as uuidv4} from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { type } from 'os';
const fs = require('fs')
const XLSX = require("xlsx")

@Injectable()
export class TeacherService {

    constructor (@InjectRepository(Teacher) private teacherRepository : Repository<Teacher>){ }
    private salt : number = 12;
  

    // for other services like lesson , news ...
    public async findTeacherByIdOrThrowExp ( teacher_Id : number) {
        try {
          let teacher = await this.teacherRepository.findOne({
            select : ['id' , 'name' , 'lastName' ,'email', 'profileImage' , 'wilaya', 'dateOfBirth'] ,
            where : {
              id : teacher_Id
            }
            });
          if(teacher) return teacher;
        } catch (error) {
          throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201);
        }
        throw new HttpException(My_Helper.FAILED_RESPONSE(`teacher not found`) , 201);
      
      
      }


    async createTeacher ( teacherData : CreateTeacherDto) {
        let teacher;
    try {    
          teacher = await this.teacherRepository.save(teacherData);       
    } catch ( e ){
        
        console.log(e.message)
        throw (new HttpException({ success : false , 
        message : 'Email Exist' } , 201))
    }


     delete teacher.password;
    return teacher;    

    }


   async getAllTeachers( ){ 
        try {
            return await this.teacherRepository.find({select : [
             'id' , 
             'name' ,
             'lastName' , 
             'dateOfBirth' ,
             'email' ,
             'wilaya',
             'profileImage' ,
             'created_at'  ,
             'updated_at' ]});

        } catch( e ) {
            throw (new HttpException({ 
                success : false , 
                message : 'something wrong !',
            } , 201))
         }
    }


    async TeacherLogin (  param : LoginTeacherDto ) { 
        let teacher ;
      
        try { 
         teacher = await this.teacherRepository.findOne( { email : param.email }) ; 
         }
         catch ( e ){ 

            throw ( new HttpException( {
                success : false , 
                message : 'Something wrong !'
             }, 201));

        }

        if (! teacher || ! await bcrypt.compare( param.password , teacher.password) ) { 
            throw ( new HttpException( { 
                success : false , 
                message : 'Wrong email or password !',
            } , 201));


        } 
        delete teacher.password;
        return teacher;
    }

    async updateTeacher(teacherId : number , attrs : Partial<Teacher> ) { 
        
        let teacher;
        try { 
            console.log(teacherId);
               teacher = await this.teacherRepository.findOne({id : teacherId});
        } catch (e) {
            
            throw new HttpException(
              {
                success : false  , 
                message : 'Something wrong but ana khatini , ana manish ana , piratawni!'
              },
              201)

         }
                if (!teacher) { 
            throw new HttpException({
                success : false , 
                message : 'This teacher not exist !',
            } , 201);
        }
        

        if (attrs.password) { 
            let newHashedPassword = await bcrypt.hash(attrs.password , this.salt);
            attrs.password = newHashedPassword;
        }

        Object.assign(teacher , attrs);

        try { 
            await this.teacherRepository.save(teacher);
        } catch ( e )  { 
            throw new HttpException({
                success : false , 
                message : 'Email exist , you cant update !',
            } , 201);
        }
      
        delete teacher.password;
        return teacher;
    }

  async findTeacherById ( id : number ) {

        if (isNaN(id)) {
            throw new BadRequestException('Id must be number!')
        }

        let teacher;
        try { 
           teacher = await this.teacherRepository.findOne({ id : id});
        }catch (e) {
             throw ( new HttpException( { success : false , 
            message : 'Something wrong !'
        } , 201))
         }


         if (!teacher) throw new HttpException(My_Helper.FAILED_RESPONSE( 'Teacher not found !' ) , 201);
         delete teacher.password;
         return teacher;

    }



    async removeTeacher( id : number) {
          let teacher = await this.findTeacherById(id);  
          
          try {
                if (teacher.profileImage) { 
             let profilePath = My_Helper.teacherImagesPath + teacher.profileImage;
             await fs.unlinkSync(profilePath);
            }
            await this.teacherRepository.remove(teacher);

          } catch ( e) {   
                       
            await this.teacherRepository.remove(teacher);
            throw new HttpException(My_Helper.FAILED_RESPONSE(' teacher removed , but something wrong happen while removing the profile image' ), 201);
           
          }
          

    
        }


    async updateProfilePicture ( teacher_Id : number , file : Express.Multer.File ) { 
        let teacher = await this.findTeacherByIdOrThrowExp(teacher_Id);
        if  ( !file || ! My_Helper.is_Image(file.mimetype) ) { 
           throw new HttpException( My_Helper.FAILED_RESPONSE("image must be a {.png, .jpeg, .jpg } ") , 201)
        };

        let filePath;

        if ( !teacher.profileImage ) { 
            let imageName = 'teacher_'+uuidv4() + My_Helper.fileExtinction(file.mimetype);
             filePath = My_Helper.teacherImagesPath + imageName;
            teacher.profileImage = imageName;
        } else { 
            filePath = My_Helper.teacherImagesPath + teacher.profileImage;
        }

        let streamWriter = createWriteStream(filePath);
        streamWriter.write(file.buffer);

        return await this.teacherRepository.save(teacher);

    }


    async showProfilePicture ( profileImageName : String , @Res() res ){
        try {
            let module_Image = await res.sendFile(join(process.cwd() , My_Helper.teacherImagesPath + profileImageName))
            return module_Image;
        } catch (error) {
            throw new HttpException({ 
                success : false , 
                message : ' image not found !' , 
               } , 201)
        }
     }



     async modulesOfTeacher(teacher_Id : number) {
         let teacher = await this.findTeacherByIdOrThrowExp(teacher_Id);
 
         try {
         
         let modules = await this.teacherRepository.query(`SELECT distinct m.* , l.lesson_Type = 'COURS' as 'isTheLecturer' from teacher t  inner join lesson l on
          l.teacher_Id = t.id  INNER JOIN module m 
         on l.module_Id  = m.id where l.teacher_Id = ${teacher_Id} ;`)

            return modules;
         }
    
          catch (error) {
            
            throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
            
         }
    }


async teacherGroups(teacher_Id : number) {
    let teacher = await this.findTeacherByIdOrThrowExp(teacher_Id);
  try {
     let teacherLessons = await this.teacherRepository.query("select distinct g.* ,s.name as 'inSection' , l.name as 'inLevel'  from lesson,`group` g ,`section` s, `level` l , batch b where g.id = lesson.group_Id and g.section_Id = s.id and s.batch_Id = b.id and b.level_Id = l.id  and lesson.teacher_Id ="+teacher.id );
      return teacherLessons;
  } catch (error) {
     throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ' + error.message) , 201);
  }
  
  }
  


  async addTeachersByExcelFile( file : Express.Multer.File ) {
var workbook = XLSX.read(file.buffer );

let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
// Reading our file
  
let data = []
  
const sheets = workbook.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}
  
// Printing data

let newTeachersArr = [];

 for( let x = 0 ; x<data.length ; x ++) {

     try {
    let hashedPassword = await bcrypt.hash(data[x].PASSWORD , this.salt);
    let newTeacherFromEXCEL = await this.teacherRepository.create({name : data[x].NAME , lastName :data[x].LASTNAME ,email : data[x].EMAIL , password :hashedPassword , wilaya : data[x].WILAYA  });

       let newTeacher = await this.teacherRepository.save(newTeacherFromEXCEL); 
       delete newTeacher.password;
       newTeachersArr.push(newTeacher);       
    } catch (error) {
        
        throw ( new HttpException( { 
            success : false , 
            message : 'something wrong !',
            error : error.message
        } , 201));

    } 
}
return newTeachersArr;


  }





}
