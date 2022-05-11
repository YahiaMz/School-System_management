import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from 'src/level/entities/level.entity';
import { LevelService } from 'src/level/level.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Section } from 'src/section/entities/section.entity';
import { SectionService } from 'src/section/section.service';
import { Speciality } from 'src/speciality/entities/speciality.entity';
import { In, Repository } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';
import { Batches_has_many_specialities } from './entities/batches_has_many_specialities.entiity';

@Injectable()
export class BatchService {


  constructor (@InjectRepository(Batch) private batchRepo : Repository<Batch>  , 
  private levelService : LevelService ,
  @InjectRepository(Speciality) private specRepo : Repository<Speciality> , 
  @InjectRepository(Batches_has_many_specialities) private add_spec_to_batchRepo : Repository<Batches_has_many_specialities> , 
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    
    let level = await this.levelService.findOne(createBatchDto.level_id);
    let batch;

    try { 
      batch =  this.batchRepo.create({
         year : createBatchDto.year , name : createBatchDto.name }
         );
      batch.level = level;
     await this.batchRepo.save(batch);
    }catch( e ){
      console.log(e.message , e.code);
        throw ( 
        new HttpException(My_Helper.FAILED_RESPONSE('Year Exist ,( Level must have just one batch in one year )') , 201)
        );
     }

     return batch;

  }

 async findAll( ){
try { 
   let batches =  await this.batchRepo.find({ relations : ['level']});

    return batches;

}catch( e ){
  console.log(e.message);

  throw ( 
  
  new HttpException(My_Helper.FAILED_RESPONSE(' Something wrong !') , 201)
  );
 }

  }



  private async findSectionsOfBatch( batch_Id : number) { 
    let batch = this.findBatchByIdOrThrow_Exp(batch_Id);
    try {
      
    let sectionsOfBatch =await this.batchRepo.query(`SELECT * FROM section where section.batch_Id = ${batch_Id} and section.speciality_Id is null`);
   return sectionsOfBatch;
  } catch (error) {
 
    throw ( 
  
      new HttpException(My_Helper.FAILED_RESPONSE(`Something wrong ! , $error.message}`) , 201)
      );
  } 

  }


  async findOne(id: number) {
    let batch; 
    try {
       batch = await this.batchRepo.findOneOrFail(
         {  id : id   } ,
         {  relations : ['level']
           } );

       let specialitiesOfthisBatchesInItCurrentLevel = await this.add_spec_to_batchRepo.find({
         where : { 
         batch : batch , 
         in_level : batch.level
         } , 
        
         relations : ['speciality']
         }
         );

         let specialities = [];
         if ( specialitiesOfthisBatchesInItCurrentLevel.length>0 ) {

          for (let x : number = 0 ;x < specialitiesOfthisBatchesInItCurrentLevel.length ;x ++){
            specialities.push( specialitiesOfthisBatchesInItCurrentLevel[x].speciality);
          }


         batch['hasSpecialities'] = true;
          batch['specialities'] = specialities;

       return batch;
      } else { 
        let sections = await this.findSectionsOfBatch(batch.id) ;
        batch['hasSpecialities'] = false;
        batch['sections'] = sections;
      
        return batch;
      }

      } catch (e) {
        console.log(e.message);
        
        throw ( 
          new HttpException(My_Helper.FAILED_RESPONSE('Batch not found !') , 201)
          ); 
     }
  }


  // you're using this function in chapter , with the help of dependency injection dp
public async findBatchByIdOrThrow_Exp( id : number) {
  let batch; 
    try {
        batch = await this.batchRepo.findOne({id : id  } , {loadRelationIds : true});
     } catch (error) {
       throw (new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201))
     }

     if ( !batch) { 
       throw new HttpException( My_Helper.FAILED_RESPONSE('batch not found !') , 201);
     }
     return (batch);

}


  async update(id: number, attrs : UpdateBatchDto) {
        console.log(attrs);

   
     
    let batchForUpdate = await this.findBatchByIdOrThrow_Exp(id);
     if(attrs.level_id) {
    let newLevel = await this.levelService.findOneForUpdate(attrs.level_id);
    batchForUpdate.level = newLevel;
     
  }

   Object.assign(batchForUpdate , attrs);
   try {
    batchForUpdate = await this.batchRepo.save(batchForUpdate);
   } catch (error) {
    throw ( 
      new HttpException(My_Helper.FAILED_RESPONSE('Year Exist ,( Year must have just One Batch )') , 201)
      );
   }
   return batchForUpdate;
  }

  async remove(id: number) {
      let batch = await this.findBatchByIdOrThrow_Exp(id);
      try {
        await this.batchRepo.remove(batch);
      } catch (e) {
        throw ( 
          new HttpException(My_Helper.FAILED_RESPONSE('Batch not removed , Something wrong !') , 201)
          );
      }
    }



    private async  findSpecialityByIdOrThrowExp( id : number ) {
     let spec;
      try {
          spec = await this.specRepo.findOne({id : id});
        } catch (error) {
          throw (
            new HttpException( My_Helper.FAILED_RESPONSE('Something wrong happen when searching speciality !'), 201)
          )
        }

        
        if ( !spec ) throw new HttpException( 
          My_Helper.FAILED_RESPONSE('speciality not found , so you cant add this speciality to this batch')
           ,  
          201
        );

        return spec;
    }


  async addSepciality ( batch_Id : number , speciality_Id : number , level_Id : number ) { 
    
    // validating the existing of batch and speciality 
    
    let newSpec = await this.findSpecialityByIdOrThrowExp(speciality_Id);
    let batch = await this.findBatchByIdOrThrow_Exp(batch_Id);
    let whenAddedLevel = await this.levelService.findOneForUpdate(level_Id);  
    
    
    try {
      
      let spec_batch_level_Relation = this.add_spec_to_batchRepo.create();

      spec_batch_level_Relation.batch = batch;
      spec_batch_level_Relation.in_level = whenAddedLevel;
      spec_batch_level_Relation.speciality = newSpec;

      await this.add_spec_to_batchRepo.save(spec_batch_level_Relation);
      return spec_batch_level_Relation;

    } catch (error) {
      throw new HttpException( 
        My_Helper.FAILED_RESPONSE(`something wrong ! , err : ${error.message}`)
         ,  
        201
      );
    }




   


  }

  async increaseLevelOfBatches ( ) { 
 
    
    try {
      let batchesOrderByLevel = await this.batchRepo.query('SELECT b.* FROM batch b inner join `level` l on b.level_Id  = l.id ORDER BY l.`level` DESC  ;');

      if (batchesOrderByLevel.length != 0) {
      let nextLevel = null;


    for ( let x = batchesOrderByLevel.length -1 ; x > -1 ; x -- ) { 
            let currentBatch = batchesOrderByLevel[x];
            await this.batchRepo.query(`UPDATE batch set batch.level_Id = ${nextLevel} where  batch.id = ${currentBatch.id}`);
            nextLevel = currentBatch.level_Id;
      } 
    }
    return;
      }
     catch (error) {
      throw new HttpException( 
        My_Helper.FAILED_RESPONSE(`something wrong while upgrading batches ! , err : ${error.message}`)
         ,  
        201
      )

      
    }

      
  }



}