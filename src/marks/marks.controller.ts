import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post('/newRow')
  async create(@Body() createMarkDto: CreateMarkDto) {
    let markRow = await this.marksService.putMarks(createMarkDto);
    return My_Helper.SUCCESS_RESPONSE(markRow)
  }

  @Get('/ofStudent=:student_Id/InSemester=:semester')
  async findAll(@Param('student_Id') studentId : string , @Param('semester') semester : string) {
   
    if( isNaN(+semester) ) {
      return My_Helper.SUCCESS_RESPONSE( 'current Semester must be a number' );
          }  

  let semesters : number[] = [1 , 2];

  if(!semesters.find(cs => cs ===  +semester)){
     return  My_Helper.SUCCESS_RESPONSE( 'current Semester must be one of the following values : {1 , 2}');
  }

    let marksOfStudent = await this.marksService.findAll(+studentId , +semester);
    return My_Helper.SUCCESS_RESPONSE(marksOfStudent)
  }

  @Get('/ofGroup=:id/InModule=:mId')
  async findOne(@Param('id') id: string , @Param('mId') mId) {
    let marksOfGroup = await this.marksService.findMarksOfGroup(+id , +mId);
    return My_Helper.SUCCESS_RESPONSE(marksOfGroup)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkDto: UpdateMarkDto) {
    return this.marksService.update(+id, updateMarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marksService.remove(+id);
  }
}
