import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentSemester } from './entities/current-semester.entity';

@Injectable()
export class CurrentSemesterService {

    constructor( @InjectRepository(CurrentSemester) private cSemesterRepo : Repository<CurrentSemester> ) { }
 
     public async getCurrentSemester ( ) :Promise<CurrentSemester> {
    
        try {
            
        let cSemester = await this.cSemesterRepo.findOne();
        if(cSemester) { 
            return cSemester;
        }
         else {
            let cSmstr = this.cSemesterRepo.create({
                id : 1 , 
                current_semester : 1
            });

            await this.cSemesterRepo.save(cSmstr);
            return cSmstr;
        }
    
    } catch (error) {
        throw new HttpException( {
            success : false , 
            message : 'something wrong !' , 
            error : error.message
        }, 201);
            
    }
    
    }

    public async changeCurrentSemester( currentSemester : string) { 
        
      if( isNaN(+currentSemester) ) {
          throw new HttpException({
              success : false , 
              message : 'current Semester must be a number'
              }  
             , 201);
      }

      let semesters : number[] = [1 , 2];

      if(!semesters.find(cs => cs === +currentSemester)){
        throw new HttpException('current Semester must be one of the following values : {1 , 2}' , 201);
      }

      let currentS = await this.getCurrentSemester();

      try {
          
           if(currentS.current_semester != +currentSemester) {
            currentS.current_semester = +currentSemester;
            await this.cSemesterRepo.save(currentS);
           }

           return currentS;
    } catch (error) {
        throw new HttpException( {
            success : false , 
            message : 'something wrong !' , 
            error : error.message
        }, 201);
    }
     
      
    


    }


}
