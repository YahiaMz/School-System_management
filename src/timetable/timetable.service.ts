import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { SectionService } from 'src/section/section.service';
import { Repository } from 'typeorm';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { Timetable } from './entities/timetable.entity';

@Injectable()
export class TimetableService {


  constructor(@InjectRepository(Timetable) private timeTableRepository : Repository<Timetable>
              ,private sectionService : SectionService
  ) { 
              
  }



  public async findTimeTableByIdOrThrowException ( id : number ){ 
    try {
      let timetable = await this.timeTableRepository.findOne({where : {
        id  : id 
      }})
      if(timetable) return timetable;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
    }

    throw new HttpException(My_Helper.FAILED_RESPONSE('TimeTable not found') , 201);


  }




   async create(createTimetableDto: CreateTimetableDto) {
   let section = await this.sectionService.findSectionByIdOrThrowException(createTimetableDto.section_Id);
    try {
     let timetable = this.timeTableRepository.create({
       name : createTimetableDto.name , 
       semester : createTimetableDto.semester
     }) ;
    timetable.section = section;
    let newTimeTable = await this.timeTableRepository.save(timetable);
    return newTimeTable; 
  } catch (error) {
     console.log(error.message);
    throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong , (name , section_Id , semester ) must be unique ') , 201);
   }
  }

  async findAll() {
    try {
      let timetables = await this.timeTableRepository.find({
        relations : ['section']
      });  
       return timetables;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
     }
    
  }

 async findOne(id: number) {
    try {
      let timetable = await this.timeTableRepository.findOne({where : {
        id  : id 
      } , 
     relations : ['section']
    })



      if(timetable) {  
        delete timetable.section.created_at;
        delete timetable.section.updated_at;

        return timetable };
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
    }

    throw new HttpException(My_Helper.FAILED_RESPONSE('TimeTable not found') , 201);



  }

async update(id: number, updateTimetableDto: UpdateTimetableDto) {
    
  let timetable = await this.findTimeTableByIdOrThrowException(id);
     if(updateTimetableDto.section_Id) { 
       let section = await this.sectionService.findSectionByIdOrThrowException(updateTimetableDto.section_Id)
       timetable.section = section;
      }
      Object.assign(timetable , updateTimetableDto);

     try{ 
       let newTimeTable = await this.timeTableRepository.save(timetable);
      return newTimeTable;
     }catch( err ){ 
       console.log(err.message);
       
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
     }
    }

  async remove(id: number) {
    let timetable =  await this.findTimeTableByIdOrThrowException(id); 
    try {
       this.timeTableRepository.remove(timetable);
     } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' something wrong ') , 201);
     }

  }
}
