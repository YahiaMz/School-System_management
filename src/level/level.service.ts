import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { GroupService } from 'src/group/group.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelService {


  constructor(@InjectRepository(Level) private levelRepo : Repository<Level> ,
              private groupService : GroupService 
  ) { }

 async create(createLevelDto: CreateLevelDto) {
    let level;
    try {
     level = await this.levelRepo.save({level : createLevelDto.level ,
       name : createLevelDto.name});
    } catch (error) {
      throw (new HttpException(My_Helper.FAILED_RESPONSE('level Exist !') , 201))
    }
      return level;
  }

 async findAll() { 
   try {
    let levels =  await this.levelRepo.find({
      order : {
        level : 'ASC' ,
      }
      ,relations : ['specialities']
    });
 
    for (let x : number = 0 ; x <levels.length ; x ++ ){
       let currentBatch = await this.levelRepo.query(`select * from batch where batch.level_Id = ${levels[x].id}`);
       levels[x]['currentBatch'] = currentBatch[0];
    }

    return levels;  
   } catch (error) {
     
   }
    }

 async findOne ( id : number ){ 
  let level;
  try {
      level = await this.levelRepo.findOne({id : id} , {relations : ['specialities']});
    } catch ( e ) { 
      throw (new HttpException(My_Helper.FAILED_RESPONSE('Something wrong !') , 201))
   } 

   if(!level) throw (new HttpException(My_Helper.FAILED_RESPONSE('level not Exist !') , 201))
   let currentBatch = await this.levelRepo.query(`select * from batch where batch.level_Id = ${level.id}`);
   
   level['currentBatch'] = currentBatch[0];
   if(level.specialities.length == 0) {
     delete level.specialities;
     level['hasSpecialities'] = false ;
     let sections = await this.findSectionsOfBatch(currentBatch[0].id);
     level['sections'] = sections;

   } else { 
    level['hasSpecialities'] = true ;   
   }
    let studentsOfThisLevel = await this.levelRepo.query(`SELECT name , lastName , email , dateOfBirth ,profileImage , wilaya , group_Id 
     from student where student.batch_Id=${currentBatch[0].id}`)
   
  level['students']=studentsOfThisLevel;
  for (let x = 0 ; x < studentsOfThisLevel.length ; x ++) { 
    let groupWithSection = await this.groupService.findGroupWithHimSection(studentsOfThisLevel[x].group_Id);
     studentsOfThisLevel[x]['section'] = groupWithSection.section;
     delete groupWithSection.section;
     studentsOfThisLevel[x]['group'] = groupWithSection;
  }

   return level;


 }



 private async findSectionsOfBatch( batch_Id : number) { 
  try {
    
  let sectionsOfBatch =await this.levelRepo.query(`SELECT * FROM section where section.batch_Id = ${batch_Id} and section.speciality_Id is null`);
 return sectionsOfBatch;
} catch (error) {

  throw ( 

    new HttpException(My_Helper.FAILED_RESPONSE(`Something wrong ! , $error.message}`) , 201)
    );
} 

}


  async findOneForUpdate(id: number) {
    let level; 
    try {
        level = await this.levelRepo.findOne({id : id }, );
     } catch (error) {
       throw (new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201))
     }

     if ( !level) { 
       throw new HttpException( My_Helper.FAILED_RESPONSE('level not found !') , 201);
     }
     return (level);

  }



  async findLevelByIdWithItCurrentBatchOrThrowExp(id: number) {
    let level; 
    try {
        level = await this.levelRepo.findOne({id : id }, {relations : ['currentBatch']} );
     } catch (error) {
       throw (new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201))
     }

     if ( !level) { 
       throw new HttpException( My_Helper.FAILED_RESPONSE('level not found !') , 201);
     }
     return (level);

  }


  async update(id: number, updateLevelDto: UpdateLevelDto) {
     let level = await this.findOneForUpdate(id);
     Object.assign(level ,updateLevelDto );

     try { 
      await this.levelRepo.save(level);
     }catch( e) { 
         throw new HttpException(My_Helper.FAILED_RESPONSE('this level already exist!') , 201)
     }

     return level;
  }

 async remove(id: number) {
    let level = await this.findOneForUpdate(id);
    try { 
      this.levelRepo.remove(level);
    }catch( e){ 
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }
  }


  public async levelExist( id ) : Promise<boolean> { 
    console.log(' Executing ...');
    
   let level;
    try {
       level =  await this.levelRepo.findOne({id : id});
    } catch (error) {
       return false;
    }

    return (level)? true : false;
  }




  public async findLevelsByOrder_level( ) { 
    try {
      let levels = await this.levelRepo.find({order : {
        level : 'DESC'
      }});

      return levels;
      
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong while getting levels ordered by level DESC') , 201) 
    }
  }


  public async findLevelsWithSpecialitiesOrSections( ) { 
    let levels;
    
    try {
        levels = await this.levelRepo.find( {relations : ['specialities',"currentBatch","modules"]});
      } catch ( e ) { 
        throw (new HttpException(My_Helper.FAILED_RESPONSE('Something wrong ! ') , 201))
     } 
     
     for (let x = 0 ; x<levels.length ; x ++  ) {
      
      if(levels[x].specialities.length == 0) {
        delete levels[x].specialities;
        levels[x]['hasSpecialities'] = false ;
        let sections = await this.findSectionsOfBatch(levels[x].currentBatch.id);
        levels[x]['sections'] = sections;
      } else { 
       levels[x]['hasSpecialities'] = true ;   
       delete levels[x].modules;
      }
     }

     return levels;
  
  }


  public async doesThisLevelHasSpecialities (  level_Id : number)  :Promise<boolean> {

    let level;
    
    try {
        level = await this.levelRepo.findOne( {relations : ['specialities'] , where : {id :level_Id }});
      } catch ( e ) { 
        throw (new HttpException(My_Helper.FAILED_RESPONSE('Something wrong ! ') , 201))
     } 
     if(level)
      return level.specialities.length != 0 ;
      else return false;

  }




}
