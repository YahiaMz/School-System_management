import { HttpException, Injectable, Module, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchService } from 'src/batch/batch.service';
import { ModuleService } from 'src/module/module.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Repository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { ChapterFile } from 'src/chapter-file/entities/chapter-file.entity';
import { Message } from 'src/messages/entities/message.entity';
const fs = require('fs')

@Injectable()
export class ChapterService {
 constructor (@InjectRepository(Chapter) private chapterRepository : Repository<Chapter> ,
 @InjectRepository(ChapterFile) private chapterFilesRepo : Repository<ChapterFile> , 
              private moduleService : ModuleService , 
              private batchService  : BatchService 
 ) {}




async  create(
   createChapterDto: CreateChapterDto ) {


    let mModuleAndItBatch = await  this.moduleService.findModuleAndHisBatchWiByIdOrThrow_Exp(createChapterDto.module_Id);
  
    // creating new Chapter 
    try {
      
      let chapter = this.chapterRepository.create({
        name : createChapterDto.name , 
        description : createChapterDto.description
      });

      chapter.batch = mModuleAndItBatch.itBatch;
      chapter.module = mModuleAndItBatch.module;


      return await this.chapterRepository.save(chapter);

    } catch (error) {
      console.log(error.message);
      
      
      throw new HttpException( 
       { success : false , 
      message : 'something wrong', 
      error_message : error.message
    } ,
        201);  
    }



  }

  async findChaptersOfModuleInBatch (module_Id : number , batch_Id : number ) {
    
    let mModule = await this.moduleService.findModuleByIdOrThrow_Exp(module_Id);
      let batch = await this.batchService.findBatchByIdOrThrow_Exp(batch_Id);
      

    try {
    
      
      
      return await this.chapterRepository.find({

          where : {
            batch  : batch , 
            module : mModule , 
            
          } , 
          relations : ['files']
        });
      } catch (error) {
    throw( new HttpException(
                {
                 success : false , 
                 message : 'Something wrong !',
                 error : error.message
                } , 201
                
                )
        
    );
        }
  }


  // updating chapter number one ....
  async update(id: number, updateChapterDto: UpdateChapterDto ) {
   let chapter = await this.findChapterByIdOrThrowExp(id);

  Object.assign(chapter , updateChapterDto);

  try {
  
    let uChapter = await this.chapterRepository.save(chapter);
   return uChapter;
  } catch (error) {
    throw new HttpException( My_Helper.FAILED_RESPONSE('Chapter NAME EXIST') , 201);

  }


  }

public async findChapterByIdOrThrowExp ( id : number) {
 try {
  let chapter = await this.chapterRepository.findOne({id : id} , {relations : ['files']});
  if( chapter ) return chapter;
 } catch (error) {
    throw new HttpException( { 
      success : false , 
      message : "something wrong" , 
      error_message : error.message
    }, 201)
 }
 throw new HttpException( My_Helper.FAILED_RESPONSE('chapter not found') , 201);
}


private async removeChapterFile(id: number ) {     
  try {
    let chapter = await this.chapterFilesRepo.findOne({id : id});
    let pathToRemove = My_Helper.chaptersFilesPath + chapter.fileUrl;
    await fs.unlinkSync(pathToRemove);

    await this.chapterFilesRepo.remove(chapter);
    return;
  } catch (error) {
    throw new HttpException({ 
      success : false , 
      message : 'something wrong !',
      error  : error.message  
     } , 201)
  }

    }


 async  remove(id: number) {
 let chapterToRemove = await this.findChapterByIdOrThrowExp(id);
    try {
      for (let x = 0 ; x< chapterToRemove.files.length ; x ++ ) {
       await this.removeChapterFile(chapterToRemove.files[x].id)
      }
      await this.chapterRepository.remove(chapterToRemove);
    } catch (error) {

      throw new HttpException({ 
        success : false , 
        message : "something wrong" , 
        error_message : error.error
      }, 201)
    }
  }






   async findAllChaptersOfModuleInCurrentBatch( module_Id : number  ){
     
    let mModule = await this.moduleService.findModuleAndHisBatchWiByIdOrThrow_Exp(module_Id);
    
    try {
      return await this.chapterRepository.find( {
        where : {
         module : mModule.module ,
         batch : mModule.itBatch} ,
         relations : ['files']
        },
        
         
         );
  
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !' + error.message) , 201);
    }

   } 


}
