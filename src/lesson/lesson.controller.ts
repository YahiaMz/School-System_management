import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('/create')
  async create(@Body() createLessonDto: CreateLessonDto) {
        
    let newLesson = await this.lessonService.create(createLessonDto);
    return My_Helper.SUCCESS_RESPONSE(newLesson);
  }

  @Get('/allOfSection=:section_Id/inSemester=:semester')
  async findAll(@Param('section_Id') section_Id : string , @Param('semester') semester : string) {
  

    if (section_Id && isNaN(+ section_Id ) ) { 
      return {
        success : false , 
        message : 'section_Id must be an integer'
      }
    } 
    if (semester && isNaN( + semester ) ) { 
      return {
        success : false , 
        message : ' semester must = { 1 or 2 }  '
      }
    } 


    let lessonsOfSection = await this.lessonService.findAll_LessonsOfSection(+section_Id  ,+semester);
    return My_Helper.SUCCESS_RESPONSE(lessonsOfSection);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.lessonService.findOne(+id);
  // }

  @Get('/ofTeacher/:id')
  async TeacherLessons(@Param('id') id: string) {
    let lessons =  await this.lessonService.teacherSchedule(+id);
    return My_Helper.SUCCESS_RESPONSE(lessons);
  }


  @Get('/ofGroup/:id')
  async groupLessons(@Param('id') id: string) {
    let lessons =  await this.lessonService.groupSchedule(+id);
    return My_Helper.SUCCESS_RESPONSE(lessons);
  }



  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    await this.lessonService.remove(+id);
    return My_Helper.SUCCESS_RESPONSE('lesson deleted with success '); 
  }
}
