import { Controller, Get, Param, Post } from '@nestjs/common';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { CurrentSemesterService } from './current-semester.service';

@Controller('current-semester')
export class CurrentSemesterController {
  constructor(private readonly currentSemesterService: CurrentSemesterService) {

    
  }


  @Get()
  async getCurrentSemester(  ){
       let cSemester = await this.currentSemesterService.getCurrentSemester()
        return await My_Helper.SUCCESS_RESPONSE(cSemester.current_semester);
      }


  @Post('/changeTo/:currentSemester')
  async changeCurrentSemester( @Param('currentSemester') currentSemester : string ){
    
       let cSemester = await this.currentSemesterService.changeCurrentSemester(currentSemester)
        return await My_Helper.SUCCESS_RESPONSE(cSemester.current_semester);
      }



}
