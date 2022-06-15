import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { CreateStudentDto } from './dtos/createStudent.dto';
import { LoginStudentDto } from './dtos/student-login.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { StudentService } from './student.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

@Controller('student')
export class StudentController {

constructor( private studentService : StudentService){}


@Post('/create')
async createNewStudent( @Body() createStudentDto : CreateStudentDto) {
     let newStudent = await this.studentService.create(createStudentDto);
     return My_Helper.SUCCESS_RESPONSE(newStudent); 
}

@Post('/addByExcelFile/InLevel=:level_Id')
@UseInterceptors(FileInterceptor('file'))
async addByExcelFile(@Param('level_Id') level_Id : string ,  @UploadedFile() file : Express.Multer.File ){
  
    if ( !file || !My_Helper.isXLSX_File(file.mimetype) ) {
        return My_Helper.FAILED_RESPONSE('File must be not null and of type {.xlxs}')
     }


     let newStudents = await this.studentService.addStudentByExcelFileInLevel(file , +level_Id);
     return My_Helper.SUCCESS_RESPONSE(newStudents);


   }  



@Post('/login')
async login(@Body() body : LoginStudentDto) { 
     return My_Helper.SUCCESS_RESPONSE( await this.studentService.studentLogin(body) );
}

@Patch('/update/:studentId')
async update(  @Param('studentId') id : number,  @Body() body : UpdateStudentDto) {
     let student = await this.studentService.updateStudent(id , body);
 return My_Helper.SUCCESS_RESPONSE( student );

}





@Delete('/delete/:id')
async deleteStudent (@Param('id') studentId : number) {
     await this.studentService.deleteStudent(studentId);
     return My_Helper.SUCCESS_RESPONSE('student removed with success ');
}


@Get('/all')
async getAllStudents ( ) { 
     return My_Helper.SUCCESS_RESPONSE( await this.studentService.allStudents() );
     
}
@Get('/allOfSpeciality/:spec_Id')
async getAllStudentsOfSepecaility (@Param('spec_Id') speciality_Id : number ) { 
     return My_Helper.SUCCESS_RESPONSE( await this.studentService.getAllStudentOfSpec( speciality_Id) );
     
}


@Get('/:id')
async getStudentById (@Param('id') studentId ) { 
     return My_Helper.SUCCESS_RESPONSE( await this.studentService.findStudentById(studentId));
}


@Post('/updateProfileImage/:id')
@UseInterceptors(FileInterceptor('image'))
async updateProfileImage (@Param('id') studentId : number,  @UploadedFile() file : Express.Multer.File) { 
    return await this.studentService.updateProfileImage(studentId , file)
}


@Get('/profile-images/:imageName')
async getProfileImage( @Param('imageName') image_profile : string , @Res() res) { 
     await this.studentService.getProfileImage(res , image_profile);
}


}
