import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterService } from 'src/chapter/chapter.service';
import { Repository } from 'typeorm';
import { CreateChapterFileDto } from './dto/create-chapter-file.dto';
import { UpdateChapterFileDto } from './dto/update-chapter-file.dto';
import { ChapterFile } from './entities/chapter-file.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
const fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { checkPrime } from 'crypto';

@Injectable()
export class ChapterFileService {

constructor( @InjectRepository(ChapterFile) private chapterFileRepo : Repository<ChapterFile> , 
             private chapterService : ChapterService 
){

}

async  create(createChapterFileDto: CreateChapterFileDto , file : Express.Multer.File) {

let chapter= await this.chapterService.findChapterByIdOrThrowExp(createChapterFileDto.chapter_Id);

let chapterFilePath;
try {
         let chapterFile =  this.chapterFileRepo.create();
        
         chapterFile.chapter = chapter;
         chapterFile.name = createChapterFileDto.fileName ; 

         let chapterFileName = "chapter_"+chapter.name+"_"+createChapterFileDto.fileName+"_"+uuidv4() + My_Helper.fileExtinction(file.mimetype);
         chapterFilePath = My_Helper.chaptersFilesPath + chapterFileName;
         const ws = createWriteStream(chapterFilePath);
         ws.write(file.buffer);
            
        let newChapterFile = this.chapterFileRepo.create({name : createChapterFileDto.fileName , fileUrl : chapterFileName , chapter : chapter });
         
         let newChFile =  await this.chapterFileRepo.save(newChapterFile);
         delete newChFile.chapter;
         
         chapter.files.push(newChFile);

         return chapter;
        } catch (error) {
          
          await fs.unlinkSync(chapterFilePath);


          throw new HttpException({ 

            success : false , 
            message : 'something wrong !',
            error : error.message  
           } , 201)
         
       }

  }

  async find_All_files_of_chapter(chapter_Id  : number) {
    let chapter = await this.chapterService.findChapterByIdOrThrowExp(chapter_Id);
    try {
      let files =await this.chapterFileRepo.find({chapter : chapter})
      return files;
    } catch (error) {
     
      throw new HttpException({ 
        success : false , 
        message : 'something wrong !',
        error : error.message  
       } , 201)
    
    }  
      
  }

async  findChapterFileByIdOrThrowException( id: number) {
  
    try {
      let chapterFile = await this.chapterFileRepo.findOne({id : id});
       if(chapterFile){
         return chapterFile;
       }
    } catch (error) {
      throw new HttpException({ 
        success : false , 
        message : 'something wrong !',
        error : error.message  
       } , 201)
    }
    throw new HttpException({ 
      success : false , 
      message : 'chpaterFile Not Found !',
     } , 201)

  }

 async update(id: number, newFileName: string , chpaterFile : Express.Multer.File) {
  let cFile = await this.findChapterFileByIdOrThrowException(id);
  if(chpaterFile) {
    let chapterFilePath = My_Helper.chaptersFilesPath + cFile.fileUrl;
    const ws = createWriteStream(chapterFilePath);
    ws.write(chpaterFile.buffer);
  }
 
  if(newFileName) {
    cFile.name = newFileName;
  }

  try {
    return await this.chapterFileRepo.save(cFile);
  } catch (error) {
  
  throw new HttpException({ 
    success : false , 
    message : 'something wrong !',
    error : error.message  
   } , 201)
 
}

  
  }

 async remove(id: number) {
  let cFile = await this.findChapterFileByIdOrThrowException(id);
     
  try {
    let pathToRemove = My_Helper.chaptersFilesPath + cFile.fileUrl;
    await fs.unlinkSync(pathToRemove);
    await this.chapterFileRepo.remove(cFile);
      return;
  } catch (error) {
    throw new HttpException({ 
      success : false , 
      message : 'something wrong !',
      error : error.message  
     } , 201)
  }

    }



    async  sendChapterFileName( fileUrl : string  , @Res() res){ 
          let module_Image =  await res.sendFile(join(process.cwd() , My_Helper.chaptersFilesPath + fileUrl) );
          return module_Image;
    
   }

}
