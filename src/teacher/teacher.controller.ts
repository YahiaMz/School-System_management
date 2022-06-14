import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { CreateTeacherDto } from './dtos/create-teacher-dto';
import { TeacherService } from './teacher.service';
import * as bcrypt from 'bcrypt';
import { LoginTeacherDto } from './dtos/teacher-login.dto';
import { UpdateTeacherDto } from './dtos/update-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('teacher')
export class TeacherController {


    constructor ( private teacherService : TeacherService)
    {

     }
    @Post('/create')
    async create( @Body() teacherData : CreateTeacherDto) {         
      
        let hashedPassword = await bcrypt.hash(teacherData.password , 12);
        teacherData.password = hashedPassword;

   let newTeacher = await this.teacherService.createTeacher(teacherData);

       return My_Helper.SUCCESS_RESPONSE(newTeacher);
    }

    @Get('/all')
    async displayAllTeachers ( ) { 
        let teachers = await this.teacherService.getAllTeachers( )
        return My_Helper.SUCCESS_RESPONSE(teachers);
    }



    @Get('/:id')
    async findTeacherById ( @Param('id') teacherId : string) { 
        let teacher= await this.teacherService.findTeacherById( Number(teacherId));
        return My_Helper.SUCCESS_RESPONSE(teacher);
    }



    @Post('login')
    async login(@Body( ) body : LoginTeacherDto) {
    
        let teacher = await this.teacherService.TeacherLogin(body);
    return My_Helper.SUCCESS_RESPONSE(teacher);

    }



    @Patch('/update/:id') 
    async updateTeacher( @Param('id') teacherId : number, @Body() body : UpdateTeacherDto) {
        let updatedTeacher = await this.teacherService.updateTeacher(teacherId,body);
        return My_Helper.SUCCESS_RESPONSE(updatedTeacher)
     }


     @Delete('/delete/:id')
     async removeTeacher( @Param('id') id : number ) {
         await this.teacherService.removeTeacher(id);
         return My_Helper.SUCCESS_RESPONSE('teacher has been removed with success !')
     }




     @Post('/updateProfileImage/:id')
     @UseInterceptors(FileInterceptor('image'))
     async updateProfilePicture(@Param('id')  teacher_Id , @UploadedFile() file : Express.Multer.File ){ 
              
        let uTeacher =  await this.teacherService.updateProfilePicture(+teacher_Id , file);
        return My_Helper.SUCCESS_RESPONSE(uTeacher);
    }  




     @Post('/addByExcelFile/')
     @UseInterceptors(FileInterceptor('file'))
     async addByExcelFile( @UploadedFile() file : Express.Multer.File ){
       
         if ( !file || !My_Helper.isXLSX_File(file.mimetype) ) {
             return My_Helper.FAILED_RESPONSE('File must be not null and of type {.xlxs}')
          }


          let newTeachers = await this.teacherService.addTeachersByExcelFile(file);
          return My_Helper.SUCCESS_RESPONSE(newTeachers);
    
    
        }  





    @Get('/profile-images/:profileImage')
    async sendProfileImage ( @Param('profileImage') profileImage : string , @Res() res ){ 
       return await this.teacherService.showProfilePicture(profileImage,  res);
    }


    @Get('/modulesOfTeacher/:teacher_Id')
    async getModulesOfTeacher( @Param('teacher_Id') teacher_Id : string ){ 
       let modules = await this.teacherService.modulesOfTeacher(+teacher_Id);
    return My_Helper.SUCCESS_RESPONSE(modules);
    }

    @Get('/:id/groups')
    async TeacherGroups(@Param('id') id: string) {
      let groups =  await this.teacherService.teacherGroups(+id);
      return My_Helper.SUCCESS_RESPONSE(groups);
    }
  

}
