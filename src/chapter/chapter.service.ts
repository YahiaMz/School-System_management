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
const fs = require('fs')

@Injectable()
export class ChapterService {
 constructor (@InjectRepository(Chapter) private chapterRepository : Repository<Chapter> , 
              private moduleService : ModuleService , 
              private batchService  : BatchService 
 ) {}

async  create(
   createChapterDto: CreateChapterDto ,
   lecture_file : Express.Multer.File ,
    td_file : Express.Multer.File , td_correction_file : Express.Multer.File) {

  
  
   if ( !lecture_file || !My_Helper.is_Lecture(lecture_file.mimetype) ) {
          throw new HttpException( 
            My_Helper.FAILED_RESPONSE('lecture File must be not null and of type {.pdf , .ppt }')
            , 201
            );
   }

   let td_file_Name = null;
 
   if (td_file ) { 
        if(!My_Helper.is_Lecture(td_file.mimetype)) {
          throw new HttpException(My_Helper.FAILED_RESPONSE("TD file must be of type {.pdf , .ppt}") , 200)
        } 
      td_file_Name =  'td_'+createChapterDto.name+'_'+ uuidv4()+My_Helper.fileExtinction(td_file.mimetype);
      }

       
      let td_correction_file_name = null;
   if (td_correction_file ) { 
    if(!My_Helper.is_Lecture(td_correction_file.mimetype)) {
      throw new HttpException(My_Helper.FAILED_RESPONSE("Td correction file must be of type {.pdf , .ppt}") , 200)
    } 
    td_correction_file_name =  'td_Correction_'+createChapterDto.name+'_'+ uuidv4()+ My_Helper.fileExtinction(td_file.mimetype);
  }


    let mModule = await  this.moduleService.findModuleByIdOrThrow_Exp(createChapterDto.module_Id);
    let batch  = await  this.batchService.findBatchByIdOrThrow_Exp(createChapterDto.batch_Id);
    
    




    delete batch.specialities;
    delete batch.created_at;
    delete batch.updated_at;

    delete mModule.created_at;
    delete mModule.updated_at;

    // creating new Chapter 
    try {
      
      let chapter = this.chapterRepository.create({
        name : createChapterDto.name , 
        description : createChapterDto.description
      });

      chapter.batch = batch;
      chapter.module = mModule;

      let mLecture_fileName = 'Cours_'+createChapterDto.name+'_'+ uuidv4()  + My_Helper.fileExtinction(lecture_file.mimetype);
      let mPath = My_Helper.chaptersFilesPath + mLecture_fileName;

      const writeStreamForChapter = createWriteStream(mPath);
        writeStreamForChapter.write(lecture_file.buffer)
        chapter.lecture_file = mLecture_fileName;
      
        // saving the fucking td file 
        if  (td_file_Name) {
        const writeStreamForTdFile = createWriteStream (My_Helper.chaptersFilesPath +td_file_Name);
        writeStreamForTdFile.write(td_file.buffer);
        chapter.td_file = td_file_Name;
       } 

       // saving the fucking td_correctionFILE
       if  (td_correction_file_name) {
        const writeStreamForTdFileCorrection = createWriteStream (My_Helper.chaptersFilesPath + td_correction_file_name);
        writeStreamForTdFileCorrection.write(td_correction_file.buffer);
        chapter.td_correction_file = td_correction_file_name;
       } 


      return await this.chapterRepository.save(chapter);

    } catch (error) {
      console.log(error.message);
      
      
      throw new HttpException( 
       { success : false , 
      message : 'something wrong' , 
      error_message : error.message
    } ,
        201);  
    }



  }

  async findChaptersOfModule (module_Id : number , batch_Id : number ) {
    let mModule = this.moduleService.findModuleByIdOrThrow_Exp(module_Id);
    let batch = this.batchService.findBatchByIdOrThrow_Exp(batch_Id);
    try {
        return await this.chapterRepository.find({
          where : {
            batch  : batch , 
            module : mModule , 
          }
        });
      } catch (error) {
        throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
      }

  }

  findOne(id: number) {
    return `This action returns a #${id} chapter`;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

private async findChapterByIdOrThrowExp ( id : number) {
 try {
  let chapter = await this.chapterRepository.findOne({id : id});
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


 async  remove(id: number) {
 let chapterToRemove = await this.findChapterByIdOrThrowExp(id);
    try {
      fs.unlinkSync(My_Helper.chaptersFilesPath+chapterToRemove.lecture_file); 
      await this.chapterRepository.remove(chapterToRemove);
    } catch (error) {
      throw new HttpException( { 
        success : false , 
        message : "something wrong" , 
        error_message : error.message
      }, 201)
    }
  }



  async sendLecturesFiles(file_name : string , @Res() res) {
    try {
      let lecture = await res.sendFile(join(process.cwd() , My_Helper.chaptersFilesPath + file_name));
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('file not found') , 201);
    }
   }


}
