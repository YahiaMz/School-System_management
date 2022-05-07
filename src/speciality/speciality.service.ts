import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from 'src/batch/entities/batch.entity';
import { Module } from 'src/module/module.entity';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import {  Repository } from 'typeorm';
import { AddModuleToSpecialityDto } from './dto/addModuleToSpeciality.dto';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { Speciality } from './entities/speciality.entity';
import { SpecialityHasManyMoudules } from './entities/specialityHasManyModule.entity';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, fstat } from 'fs';
import { join } from 'path';
const fs = require('fs');


@Injectable()
export class SpecialityService {

  constructor(@InjectRepository(Speciality) private specialityRepo : Repository<Speciality> , 
      @InjectRepository(Batch) private batchRepo : Repository<Batch> ,
      @InjectRepository(Module) private moduleRepo : Repository<Module>  , 
      @InjectRepository(SpecialityHasManyMoudules) private specialityHasManyModules : Repository<SpecialityHasManyMoudules>
  ) {
    
  }




  private async findBatchByIdOrThrowException ( batch_Id : number ) { 
    let batch;
    try {
       batch = await this.batchRepo.findOne({id : batch_Id});
    } catch (error) {
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }

 
    if (!batch) { 
      throw new HttpException(My_Helper.FAILED_RESPONSE('Batch not found , so you cant create Speciality') , 201);
    }
  return batch;

  }


  private async findModuleByIdOrThrowExp (module_Id : number ){
    
    try {
      let mModule = await this.moduleRepo.findOne({id : module_Id});
      if ( mModule )  return mModule;
    } catch (error) {
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }
    throw new HttpException(My_Helper.FAILED_RESPONSE('module not found') , 201);
   }

 private async findSpecialityByIdoOrThrowExp( id : number ) { 
  let speciality ; 
  try {
    speciality = await this.specialityRepo.findOne({id : id } ); 
  } catch (error) {

     throw ( 
       new HttpException(My_Helper.FAILED_RESPONSE('Something Wrong !' ) , 
       201)
   );
     }
   
     if ( !speciality) throw new HttpException(
       My_Helper.FAILED_RESPONSE('Speciality not found !') ,
        201 );

        return speciality;
    }



  async create(createSpecialityDto: CreateSpecialityDto , speciality_Image : Express.Multer.File) {
    

    if ( speciality_Image && !My_Helper.is_Image(speciality_Image.mimetype) ) {
      throw new HttpException(My_Helper.
        FAILED_RESPONSE('image must be [.png , .jpeg , .jpg , .webp ]') , 201 ) ;
      }


      if ( await this.specialityRepo.findOne({name : createSpecialityDto.name} )){
        throw new HttpException(My_Helper.FAILED_RESPONSE('speciality name Exist') , 201) ;
      }
        let speciality;
      try {  

          speciality =  this.specialityRepo.create(
           {
           name : createSpecialityDto.name , 
           shortName : createSpecialityDto.shortName ,
           description : createSpecialityDto.description
           });
       
          if ( speciality_Image ) { 
          let imageExtinction = My_Helper.fileExtinction(speciality_Image.mimetype);
          let fileName = 'spec_'+ uuidv4() + imageExtinction ;
          let filePath = My_Helper.specialitiesImagesPath + fileName;
     
          const ws = createWriteStream(filePath); 
          ws.write(speciality_Image.buffer);     
          speciality.imageUrl = fileName;
        }
        
          await this.specialityRepo.save (speciality);

     } catch (error) {
       console.log(error.message);
       
           throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201) ;
     }

    
     return speciality;

  }

  async findAll() { 
    try {
      let specialities = await this.specialityRepo.find({
        select : ['id' , 'name' , 'description' , 'imageUrl']
      });

    // for (let x : number = 0 ; x < specialities.length ; x ++ ) { 
      
    //     let modules = await this.specialityHasManyModules.find({
    //       relations : ['module'] ,
    //       select : ['coef' , 'semester' ,'module'],
    //       where : {
    //         speciality : specialities[x] ,
    //       }
    //     });
      
        // specialities[x]['modules'] = modules;
      // }
      return specialities;
    } catch (error) {
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201 );
    }
  }

 async  findOne(speciality_Id: number) {
    let speciality;
    try {


       speciality = await this.specialityRepo.findOne({id : speciality_Id});
       if( speciality ) { 

          let modules = await this.specialityHasManyModules.find(
          {
            select : ['coef' , 'module'] ,
            where : {
              speciality : speciality
            } ,
            relations : ['module']
          });

          speciality['modules'] = modules;

        return speciality;
       }
      } catch (error) {

       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }
 
    if (!speciality) { 
      throw new HttpException(My_Helper.FAILED_RESPONSE('Speciality not found !') , 201);
    }
  }

  async update(id: number, updateSpecialityDto: UpdateSpecialityDto) {
    let speciality = await this.findSpecialityByIdoOrThrowExp(id); 
    
    Object.assign(speciality , updateSpecialityDto);
    
    try {
      await this.specialityRepo.save(speciality);
    } catch ( e ){
      throw (
        new HttpException( 
          My_Helper.FAILED_RESPONSE('name Exist , you cant update to this name  !')
          ,
          201
        )
      );
    }

    return speciality;

  }

  async remove(id: number) {
    let speciality = await this.findSpecialityByIdoOrThrowExp(id);
    try {
        
      if(speciality.imageUrl){
        let path = My_Helper.specialitiesImagesPath + speciality.imageUrl;
         fs.unlinkSync(My_Helper.specialitiesImagesPath+speciality.imageUrl);
      }
      await this.specialityRepo.remove(speciality);

    } catch (error) {
      await this.specialityRepo.remove(speciality);
      throw new HttpException( 
        My_Helper.FAILED_RESPONSE('speciality removed but something wrong while removing it image  !')
        ,
        201
      );
    }
    
  }



  async addModule ( addModuleToSpecDto : AddModuleToSpecialityDto) { 


   let speciality = await this.findSpecialityByIdoOrThrowExp(addModuleToSpecDto.speciality_Id);
   let mModule = await this.findModuleByIdOrThrowExp(addModuleToSpecDto.module_Id);

   try {
     let specialityHasManyModules = this.specialityHasManyModules.create({
       coef : addModuleToSpecDto.coef,
      // semester : addModuleToSpecDto.semester ,
     });

     specialityHasManyModules.speciality = speciality;
     specialityHasManyModules.module = mModule;
     let addedModuleToSpeciality = await this.specialityHasManyModules.save(specialityHasManyModules);
     
     
     mModule['coef'] = addedModuleToSpeciality.coef;
    // mModule['semester'] = addedModuleToSpeciality.semester;

     speciality.newModule = mModule;
     return speciality;


   } catch (err) {
        console.log(err.message);
        
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
   }

  }


  async sendImage( imageName : string , @Res() res ) {
    try {
      let file = await res.sendFile(join(process.cwd() , My_Helper.specialitiesImagesPath+imageName));         
      return file;
   } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE(' speciality image not found') , 201);
   }
  }


  async updateSpecialityImage( speciality_Id : number , image : Express.Multer.File){    

    if ( image && !My_Helper.is_Image(image.mimetype) ) {
      throw new HttpException(My_Helper.
        FAILED_RESPONSE('image must be [.png , .jpeg , .jpg , .webp ]') , 201 ) ;
      }
  
      let speciality = await this.findSpecialityByIdoOrThrowExp(speciality_Id);  
     
      let filePath;
      if (!speciality.imageUrl) { 
  
         let imageExtinction = My_Helper.fileExtinction(image.mimetype);
         let fileName = 'spec'+ uuidv4() + imageExtinction ;
         filePath = My_Helper.specialitiesImagesPath + fileName;
         speciality.imageUrl = fileName;
         await this.specialityRepo.save(speciality);

      } else
       filePath = My_Helper.specialitiesImagesPath + speciality.imageUrl;
     
      const ws = createWriteStream(filePath);
      ws.write(image.buffer);     
       return speciality;
  
  }

}
