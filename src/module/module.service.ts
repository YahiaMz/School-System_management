import { HttpException, Injectable, NotFoundException, Res} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Level } from 'src/level/entities/level.entity';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Repository } from 'typeorm';
import { CreateModuleDto } from './dtos/create-module.dto';
import { Module } from './module.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
const fs = require('fs')
import { updateModuleDto } from './dtos/updateModule.dto';
import { SpecialityService } from 'src/speciality/speciality.service';

@Injectable()
export class ModuleService {

constructor( @InjectRepository(Module) private moduleRepository : Repository<Module> , 
             @InjectRepository(Level) private levelRepo : Repository<Level> , 
             private specialityService :  SpecialityService 
){}



 private async findLevelByIdOrThrowExp ( level_Id : number) { 

    try {
        let level = await this.levelRepo.findOne({id : level_Id} , {relations :['specialities']});
        if ( level ) return level;
    } catch (error) {
        throw new HttpException ( 
            My_Helper.FAILED_RESPONSE('something wrong ') , 
            201);
    }

     throw new HttpException( 
         My_Helper.FAILED_RESPONSE('level not found') , 
         201
     )
 }




 private async findLevelAndItCurrentBatchByIdOrThrowExp ( level_Id : number) { 
    
    let mLevel;    
    try {
        mLevel = await this.levelRepo.findOne({id : level_Id} , {relations :['currentBatch']});
        if ( mLevel!=null && mLevel.currentBatch!=null ) 
        return mLevel;
    } catch (error) {
        throw new HttpException ( 
            My_Helper.FAILED_RESPONSE('something wrong ') , 
            201);
    }

    if(!mLevel)
     throw new HttpException( 
         My_Helper.FAILED_RESPONSE('level not found') , 
         201
    );
    
    
    throw new HttpException( 
        My_Helper.FAILED_RESPONSE('there is no batch in this level') , 
        201
   );
 
    }



    async createModule ( moduleInfo : CreateModuleDto , image : Express.Multer.File  ){
         
      console.log(moduleInfo);
      

        let level = await this.findLevelByIdOrThrowExp(moduleInfo.level_Id);
        let speciality = null;
        if(moduleInfo.speciality_Id) {
            speciality = await this.specialityService.findSpecialityByIdoOrThrowExp(moduleInfo.speciality_Id);
           
            let specialityFoundInThisLevel = false;
            for ( let x = 0 ; x < level.specialities.length ; x ++ ) {
                if(level.specialities[x].id == speciality.id) {
                    specialityFoundInThisLevel = true;
                    break;
                }
            }

            if(!specialityFoundInThisLevel) {
                throw new HttpException( 
                    My_Helper.FAILED_RESPONSE('this speciality does not exist in this level ') , 
                    201
                )          
              }
        } else {
            if (level.specialities.length > 0) {
                throw new HttpException( 
                    My_Helper.FAILED_RESPONSE('this level has specialities , so you must enter speciality_Id ') , 
                    201
                )         
            }
        }

    
        if( image && !My_Helper.is_Image(image.mimetype))  { 
            throw new HttpException( My_Helper.
                FAILED_RESPONSE('image must be a [.png , .jpeg , .jpg , .webp]') , 201)
            }

        
        
        try {

                let mModule =  this.moduleRepository.create({
                 semester : moduleInfo.semester , 
                 name : moduleInfo.name , 
                 coef : moduleInfo.coef,
                 shortName : moduleInfo.shortName , 
                 description : moduleInfo.description , 
             }); 

             
             delete level.specialities;
             mModule.level = level;
             if(speciality)
             mModule.speciality = speciality;
             
             if(image) { 

             let file_name = 'module_'+uuidv4() + My_Helper.fileExtinction(image.mimetype);
             let file_path = My_Helper.modulesImagesPath + file_name;
             let ws = createWriteStream(file_path);
             ws.write(image.buffer);
             mModule.imageUrl = file_name;
             
            }

             await this.moduleRepository.save(mModule);
             return mModule;

        } catch ( e ) { 
            throw new HttpException({ 
             success : false , 
             message : 'Module name exist in database !'  , 
            } , 201)
        }


     }

    async  sendModuleImage( module_image : string  , @Res() res){ 
       try {
           let module_Image =  await res.sendFile(join(process.cwd() , My_Helper.modulesImagesPath + module_image) );
           return module_Image;
       } catch (error) {
           
       }
    }

     async updateModule ( moduleId : number , updatedData : updateModuleDto) { 
      
    
        let foundedModule;
        
        
        try {
            foundedModule = await this.moduleRepository.findOne({id : moduleId});

         } catch (error) {
            throw( new HttpException(
                {success : false , 
            message : 'Something wrong !'
         } , 201) );
        
        }
        if (!foundedModule) throw new HttpException(My_Helper.FAILED_RESPONSE('module no found') , 201);
 
        Object.assign(foundedModule , updatedData);
        let level;
        if (updatedData.level_Id) { 
             level = await this.findLevelByIdOrThrowExp(updatedData.level_Id);
             foundedModule.level = level;
            } 
        

        try { 
            await this.moduleRepository.save(foundedModule);
            return foundedModule;
   
        }catch ( e ) { 
            throw new HttpException({ 

                success : false , 
                message : ' this Module name already exist in database !' , 
               } , 201)
        }
          }

     async listAll ( ) { 
 
        try { 
             let modules = await this.moduleRepository.find( );
             return modules;
            } catch ( error ) { 
            throw (new HttpException({ 
                success : false , 
                message : 'something wrong !',
            } , 201))
          }

     } 

    async remove( id : number ){
        
        let moduleToRemove ;
        try { 
            moduleToRemove = await this.moduleRepository.findOne({id : id});
            if(moduleToRemove) { 

         
                 if (moduleToRemove.imageUrl) {
                     let pathToRemove = My_Helper.modulesImagesPath + moduleToRemove.imageUrl;
                     await fs.unlinkSync(pathToRemove);
                    }
                return await this.moduleRepository.remove(moduleToRemove);
         
            }
              } 
        catch( e ) { 

            throw ( new HttpException( {
                success : false , 
                message : 'Something wrong !'
             },
              201));
        }
        
        throw ( new HttpException( My_Helper.FAILED_RESPONSE('module not found!')  , 201)  );
        }

        // remember you're using it in Chapter Service 
   public async findModuleByIdOrThrow_Exp ( id : number ){ 
        try {
            let mModule = await this.moduleRepository.findOne({id : id} , {loadRelationIds : true});
            if( mModule ) return mModule;

        } catch (error) {
            throw new HttpException(
                 My_Helper.FAILED_RESPONSE(' something wrong !') ,
             201);
        }

        throw new HttpException(My_Helper.FAILED_RESPONSE('module not found') , 201);
    }

  
    public async findModuleAndHisBatchWiByIdOrThrow_Exp ( id : number ){ 
              
        
        let mModule = await this.findModuleByIdOrThrow_Exp(id);
            

        let currentBatchOfThisModule = await this.findLevelAndItCurrentBatchByIdOrThrowExp(+mModule.level);
        try {

            if( mModule ){ 
                
                return {
                    'module' : mModule ,
                    'itBatch' : currentBatchOfThisModule.currentBatch 
                } }


        } catch (error) {
            throw new HttpException(
                 My_Helper.FAILED_RESPONSE(' something wrong ! -> ' + error.message)  ,
             201);
        }

        throw new HttpException(My_Helper.FAILED_RESPONSE('module not found') , 201);
    }

  

    async updateImage ( id : number , image : Express.Multer.File) {
        
        let mModule = await this.findModuleByIdOrThrow_Exp(id);
                 
         if ( !image || !My_Helper.is_Image(image.mimetype)) { 
            throw new HttpException(My_Helper.FAILED_RESPONSE('image must be a {.png  , .jpeg , .jpg }') , 201);
         }
         let filePath ;
            if(!mModule.imageUrl) {
                  let fileName = 'module_'+uuidv4() + My_Helper.fileExtinction(image.mimetype);
                  filePath = My_Helper.modulesImagesPath + fileName;
                  mModule.imageUrl = fileName;
                } else {
                   filePath = My_Helper.modulesImagesPath + mModule.imageUrl;
                }
            
            let writeStream = createWriteStream(filePath);
            writeStream.write(image.buffer);

          return  await this.moduleRepository.save(mModule);

          }



}
