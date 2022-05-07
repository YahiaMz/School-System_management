import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('/create')
  async create(@Body() createLessonDto: CreateLessonDto) {
    let newLesson = await this.lessonService.create(createLessonDto);
    return My_Helper.SUCCESS_RESPONSE(newLesson);
  }

  @Get('/all')
  async findAll(@Body('timeTable_Id') timeTable_Id : number) {
    

    if (timeTable_Id && isNaN( timeTable_Id ) ) { 
      return {
        success : false , 
        message : 'timeTable_Id must be an integer'
      }
    }

    let lessonsOfTimeTable = await this.lessonService.findAll_LessonsOfTimeTable(timeTable_Id);
    return My_Helper.SUCCESS_RESPONSE(lessonsOfTimeTable);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.lessonService.findOne(+id);
  // }

  @Get('/ofTeacher/:id')
  async TeacherLessons(@Param('id') id: string) {
    let lessons =  await this.lessonService.teacherTimeTable(+id);
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
