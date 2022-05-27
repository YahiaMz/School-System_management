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



    let td_file_Name = null;
    if(td_file) {
      td_file_Name = 'td_File_'+createChapterDto.name+'_'+ uuidv4()+ My_Helper.fileExtinction(td_file.mimetype)
    }
    let td_correction_file_name = null;
    if(td_correction_file) {   
      td_correction_file_name =  'td_Correction_'+createChapterDto.name+'_'+ uuidv4()+ My_Helper.fileExtinction(td_correction_file.mimetype);
    }
  


    let mModuleAndItBatch = await  this.moduleService.findModuleAndHisBatchWiByIdOrThrow_Exp(createChapterDto.module_Id);
  
    // creating new Chapter 
    try {
      
      let chapter = this.chapterRepository.create({
        name : createChapterDto.name , 
        description : createChapterDto.description
      });

      chapter.batch = mModuleAndItBatch.itBatch;
      chapter.module = mModuleAndItBatch.module;

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
      message : 'something wrong' + error.message , 
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


  // updating chapter number one ....
  async update(id: number, updateChapterDto: UpdateChapterDto , uLectureFile : Express.Multer.File , uTdFile : Express.Multer.File , uTdCorrectionFile : Express.Multer.File) {
   let chapter = await this.findChapterByIdOrThrowExp(id);
   if(uLectureFile) {
     let mPath = My_Helper.chaptersFilesPath +  chapter.lecture_file;
    const writeStreamForChapter = createWriteStream(mPath);
    writeStreamForChapter.write(uLectureFile.buffer)
   }

   if(uTdFile){
     let uTdFileName = null;
     if (chapter.td_file) {
       uTdFileName = chapter.td_file;
     } else {
       uTdFileName = 'td_File_'+chapter.name+'_'+ uuidv4()+ My_Helper.fileExtinction(uTdFile.mimetype)
     };

     let mTdPath = My_Helper.chaptersFilesPath +  uTdFileName;
     const writeStreamForChapter = createWriteStream(mTdPath);
     writeStreamForChapter.write(uLectureFile.buffer)
    chapter.td_file = uTdFileName;
   }


   if(uTdCorrectionFile){
    let uTdCorrectionFileName = null;
    if (chapter.td_file) {
      uTdCorrectionFileName = chapter.td_correction_file;
    } else {
      uTdCorrectionFileName = 'td_Correction_File_'+chapter.name+'_'+ uuidv4()+ My_Helper.fileExtinction(uTdCorrectionFile.mimetype)
    };

    let mTdCorrectionPath = My_Helper.chaptersFilesPath +  uTdCorrectionFileName;
    const writeStreamForChapter = createWriteStream(mTdCorrectionPath);
    writeStreamForChapter.write(uLectureFile.buffer)
    chapter.td_correction_file = uTdCorrectionFileName;
  }

  Object.assign(chapter , updateChapterDto);

  try {
  
    let uChapter = await this.chapterRepository.save(chapter);
   return uChapter;
  } catch (error) {
    throw new HttpException( My_Helper.FAILED_RESPONSE('Chapter NAME EXIST') , 201);

  }


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
      await fs.unlinkSync(My_Helper.chaptersFilesPath+chapterToRemove.lecture_file); 
      if(chapterToRemove.td_file) {
       await fs.unlinkSync(My_Helper.chaptersFilesPath+chapterToRemove.td_file); 
      } 
      if(chapterToRemove.td_correction_file) {
        await fs.unlinkSync(My_Helper.chaptersFilesPath+chapterToRemove.td_correction_file); 
      }
      await this.chapterRepository.remove(chapterToRemove);
    } catch (error) {

      await this.chapterRepository.remove(chapterToRemove);


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



   async findAllChaptersOfModule( module_Id : number  ){
     
    let mModule = await this.moduleService.findModuleAndHisBatchWiByIdOrThrow_Exp(module_Id);
    
    try {
      return await this.chapterRepository.find({module : mModule.module , batch : mModule.itBatch});
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !' + error.message) , 201);
    }

   } 


}
