import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post('/create')
  async create(@Body() createTimetableDto: CreateTimetableDto) {
    let created_TimeTable =  await this.timetableService.create(createTimetableDto);
    return My_Helper.SUCCESS_RESPONSE(createTimetableDto)
  }

  @Get('/all')
 async findAll() {
    let timetables = await this.timetableService.findAll();
    return My_Helper.SUCCESS_RESPONSE(timetables);
  }

  @Get('/:id')
 async findOne(@Param('id') id: string) {
    let timetable = await this.timetableService.findOne(+id);
    return My_Helper.SUCCESS_RESPONSE(timetable);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
    
    if ( !updateTimetableDto) {
      return My_Helper.SUCCESS_RESPONSE('no thing to update');
    }
    

    let updatedTimeTable = await this.timetableService.update(+id, updateTimetableDto);
    return My_Helper.SUCCESS_RESPONSE(updatedTimeTable);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    await this.timetableService.remove(+id);
    return My_Helper.SUCCESS_RESPONSE('timetable removed with success');
  }
}
