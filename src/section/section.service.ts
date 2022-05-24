import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchService } from 'src/batch/batch.service';
import { GroupService } from 'src/group/group.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Speciality } from 'src/speciality/entities/speciality.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionService {

  constructor (@InjectRepository(Section) private sectionRepo : Repository<Section> , 
  @InjectRepository(Speciality) private specialityRepo : Repository<Speciality>  , 
  private batchService : BatchService , 
  private groupService  : GroupService
  ) { }


private async findSpecialityByIdOrThrowExp( speciality_Id : number ){

  let spec;
  try {
     spec = await this.specialityRepo.findOne({id : speciality_Id});
  } catch (error) {
    throw new HttpException( 
       My_Helper.FAILED_RESPONSE('something wrong ')
      , 201)
  }

  if ( !spec ) { 
    throw new HttpException( My_Helper.FAILED_RESPONSE('speciality not found !') , 201 );
  }

return spec;


}




// yo dont forget you're looking for speciality in batch in the current level 
async findSpeciality_In_Batch( batch_Id : number , spec_Id : number ){ 
   
  let batch = await this.batchService.findBatchByIdOrThrow_Exp(batch_Id);
  
  try {
    let specialityInBatch = await this.sectionRepo.query(`SELECT * FROM level inner join speciality on speciality.level_Id = level.id where level.id = ${batch.level}` );
    if(specialityInBatch.length > 0) { 
      return specialityInBatch[0];
    }

  } catch (error) {
    console.log(error.message);
    throw new HttpException( My_Helper.FAILED_RESPONSE('something wrong !') , 201);
  }
 
  throw new HttpException(My_Helper.FAILED_RESPONSE('speciality does not exist in this batch') , 201);

}

  async create(createSectionDto: CreateSectionDto) {
    console.log(createSectionDto);
    
    let batch = await this.batchService.findBatchByIdOrThrow_Exp(createSectionDto.batch_Id);

    if ( createSectionDto.speciality_Id ) { 
        let specialityInBatch = await this.findSpeciality_In_Batch(createSectionDto.batch_Id , createSectionDto.speciality_Id);
    }
  let section;
 try {
  section = this.sectionRepo.create({name : createSectionDto.name , batch_Id : createSectionDto.batch_Id , 
   speciality_Id : createSectionDto.speciality_Id ? createSectionDto.speciality_Id : null
  });

    await this.sectionRepo.save(section);
 } catch (error) {
   console.log(error.message);
   
  throw new HttpException( 
    My_Helper.FAILED_RESPONSE('something wrong , (name,batch_Id,speciality_Id) must be unique ')
   , 201) }

return section;

  }

  async findAll(batch_Id : number , spec_Id :number) {

    try {
    let studentsOfSpeciality =  await this.specialityRepo.query(`SELECT * FROM student where batch_Id=${batch_Id} and speciality_Id = ${spec_Id}`)
  
    for (let x = 0 ; x < studentsOfSpeciality.length ; x ++) { 
      let groupWithSection = await this.groupService.findGroupWithHimSection(studentsOfSpeciality[x].group_Id);
       studentsOfSpeciality[x]['section'] = groupWithSection.section;
       delete groupWithSection.section;
       studentsOfSpeciality[x]['group'] = groupWithSection;
    }

    let sectionsOfSpeciality =  await this.sectionRepo.query(`SELECT * FROM section s where batch_Id =${batch_Id} and speciality_Id = ${spec_Id}`);

    return {
      "students" : studentsOfSpeciality,
      "sections" : sectionsOfSpeciality
    }

    } catch (e ) {
     throw new HttpException( 
       My_Helper.FAILED_RESPONSE('something wrong while finding Section ')
      , 201) 
   }
     
  }


  async findOne(section_Id: number) {
    let section = null;
    
    try {
      section = await this.sectionRepo.findOne({
        where : {id : section_Id},
        relations : [
         "groups" ,
      ]
       });



       

    //   if ( section ) {

    // let batch = await this.batchService.findBatchByIdOrThrow_Exp(section.batch_Id);
    // let spec =await this.findSpecialityByIdOrThrowExp(section.speciality_Id);
          
    //     section['speciality'] = spec;
    //     section['batch'] = batch;

    if ( section ) {
    
      let studentOfThisSection = await this.sectionRepo.query(`select * from student where student.section_Id = ${section.id}`);
    
      for (let x = 0 ; x < studentOfThisSection.length ; x ++) { 
        let groupWithSection = await this.groupService.findGroupWithHimSection(studentOfThisSection[x].group_Id);
         studentOfThisSection[x]['section'] = groupWithSection.section;
         delete groupWithSection.section;
         delete studentOfThisSection[x].password;
         
         studentOfThisSection[x]['group'] = groupWithSection;
      }
    
      section['students'] = studentOfThisSection;

      return section;
    
    }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(My_Helper.FAILED_RESPONSE('Something wrong , Id must be a number') , 201);     
    }

    throw new HttpException(My_Helper.FAILED_RESPONSE('section not found !') , 201);

  }

  update(id: number, updateSectionDto: UpdateSectionDto) {

    let section = this.findSectionByIdOrThrowException(id);
  
    

  }

  async remove(id: number) {
    let sectionToRemove = await this.findOne(id); 
    await this.sectionRepo.remove(sectionToRemove);
  }


 public async findSectionByIdOrThrowException( id : number) {
  let section;
  try {
    section = await this.sectionRepo.findOne({
      where : {id : id},
     });
    if ( section ) return section;
  } catch (error) {
    console.log(error.message);
    throw new HttpException(My_Helper.FAILED_RESPONSE('Something wrong , Id must be a number') , 201);     
  }
  throw new HttpException(My_Helper.FAILED_RESPONSE('section not found !') , 201);
 }



 public async findSectionsByBatch_Id ( batch_Id : number ) { 

  try {
    return await this.sectionRepo.query(`SELECT * FROM section s where s.batch_Id =${batch_Id} and s.speciality_Id is null`);
  } catch (e ) {
   throw new HttpException( 
     My_Helper.FAILED_RESPONSE('something wrong while finding Section by batch_Id ')
    , 201) ;
  }
 
 }


  public async doesThisSectionExistInThisSpeciality ( section_Id , spec_Id){
   try {
     let result = await this.sectionRepo.find({
       id : section_Id , 
       speciality_Id : spec_Id
     })

     if ( result.length > 0 ) {
        return true;
     }
   } catch (error) {
    throw new HttpException( 
      My_Helper.FAILED_RESPONSE('something wrong : ' + error.message)
     , 201) ;
   }
   return false ;
  }


  public async doesThisSectionExistInThisBatch ( section_Id , batch_Id){
    try {
      let result = await this.sectionRepo.find({
        id : section_Id , 
        batch_Id : batch_Id
      })
 
      if ( result.length > 0 ) {
         return true;
      }
    } catch (error) {
     throw new HttpException( 
       My_Helper.FAILED_RESPONSE('something wrong : ' + error.message)
      , 201) ;
    }
    return false ;
   }




}