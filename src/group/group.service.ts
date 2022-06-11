import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Section } from 'src/section/entities/section.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {


  constructor(@InjectRepository(Section) private sectionRepo : Repository<Section> , 
            @InjectRepository(Group) private groupRepository : Repository<Group>
  ) {  }


//  this function is for other services like lesson , news  ... 
  public async findGroupByIdOrThrowExp ( id : number ) : Promise<Group> {
    try {
      let group = await this.groupRepository.findOne({id : id} , {relations : ['section']});
      if (group) return group;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201);
    }
  
    throw new HttpException(My_Helper.FAILED_RESPONSE(`group not found`) , 201);
  
  }

  public async findJustTheGroupByIdOrThrowExp ( id : number ) : Promise<Group> {
    try {
      let group = await this.groupRepository.findOne({id : id});
      if (group) return group;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201);
    }
  
    throw new HttpException(My_Helper.FAILED_RESPONSE(`group not found`) , 201);
  
  }

  
  private async findSectionAndItBatchAndItSpecialityIfExistByIdOrThrowExp( id : number ) { 
    try {
      let section = await this.sectionRepo.findOne({id : id} , {relations : ['batch', 'speciality']});
      if ( section ) return section;
    } catch (error) {
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ') , 201);
    }

    throw new HttpException(My_Helper
     .FAILED_RESPONSE('section not found ') , 201) 

}



  private async findSectionByIdOrThrowExp( id : number ) { 
       try {
         let section = await this.sectionRepo.findOne({id : id});
         if ( section ) return section;
       } catch (error) {
          throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ') , 201);
       }

       throw new HttpException(My_Helper
        .FAILED_RESPONSE('section not found ') , 201) 

  }

 async findGroupWithThereNewsOrThrowExp ( group_Id : number ) {
  try {
    let group = await this.groupRepository.findOne(
     { 
     where : {
      id : group_Id , 
    },
     relations : ['news']
     });
    if (group) return group;
   } catch (error) {
     throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ' ) , 201);
   }
   throw new HttpException(My_Helper.FAILED_RESPONSE('group not found') , 201);
  
  }



  async create(createGroupDto: CreateGroupDto) {
    let section = await this.findSectionByIdOrThrowExp(createGroupDto.section_Id);

    try {
      let group = this.groupRepository.create({name : createGroupDto.name});
      group.section = section;
      await this.groupRepository.save(group);
    
     return group;

    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong , group name must be unique in selected section' ) , 201);
    }


  }

  async findAll( section_Id : number){
    let section = await this.findSectionByIdOrThrowExp(section_Id);
    try {
      let groups = await this.groupRepository.find(
        {
        where :{
          section : section 
        }
            }
        );
        
      return groups;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ') , 201);
    }

    
  }

async findOne(id: number) {
 try {
   let group = await this.groupRepository.findOne(
    { 
    where : {id : id},
    relations : ['section','students']
    }   );
   if (group) return group;
  } catch (error) {
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ' ) , 201);
  }
  throw new HttpException(My_Helper.FAILED_RESPONSE('group not found') , 201);
  }


  async findGroupWithHimSection(id: number) {
    try {
      let group = await this.groupRepository.findOne(
       { 
       where : {id : id},
       relations : ['section']
       }   );
      if (group) return group;
     } catch (error) {
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ' ) , 201);
     }
     throw new HttpException(My_Helper.FAILED_RESPONSE('group not found') , 201);
     }

  async update(id: number , updateGroupDto: UpdateGroupDto) {


    let group = await this.findOne(id);

    if (! updateGroupDto.section_Id ) {
          Object.assign(group , updateGroupDto);
          await this.groupRepository.save(group);
          return group;
    }
    
    let section = await this.findSectionByIdOrThrowExp(updateGroupDto.section_Id);
     group.section = section;

     this.groupRepository.save(group);

     return group;
  }

 async remove(id: number) {
  let group  = await this.findOne(id);
  this.groupRepository.remove(group);
  }



  async findGroupNews ( group_Id : number ) {

    let group = await this.findGroupWithThereNewsOrThrowExp(group_Id);
    return group;
    
  }


  async findGroupAndItSectionWithItLevel ( id : number) { 
          let groupWithSection = await this.findGroupWithHimSection(id);
          let section = await this.findSectionAndItBatchAndItSpecialityIfExistByIdOrThrowExp(groupWithSection.id);
          
          // groupWithSection['inSection'] = section.name;
        
          // if(section.speciality != null)
          // groupWithSection['inSpeciality'] = section.speciality.shortName ? section.speciality.shortName : section.speciality.name;
          // else 
          // groupWithSection['inSpeciality'] = false;

          // groupWithSection['inBatch'] = section.batch.name;

          // delete groupWithSection.section;
          // groupWithSection['section'] = section;

          return groupWithSection;
        }



}
