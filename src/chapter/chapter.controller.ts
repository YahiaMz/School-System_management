import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { GetChaptersDto } from './dto/getChapters.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post('/create')

  async create(@Body() createChapterDto: CreateChapterDto , 
                @UploadedFiles() files : {lecture_file : Express.Multer.File[] , td_file? : Express.Multer.File[] , td_correction_file? : Express.Multer.File[]}  
              ) {

            
              //  if ( files.td_correction_file && files.td_correction_file.length > 0 && !My_Helper.is_Lecture(files.td_correction_file[0].mimetype)){
              //   return My_Helper.FAILED_RESPONSE('td correction must be of type {.pdf , .ppt }');
              //  }






                    let chapter = await this.chapterService.create(createChapterDto  );
                 return My_Helper.SUCCESS_RESPONSE(chapter);
 
  }

  @Get('/of-module=:module_Id/in-batch=:batch_Id')
  async findAll(@Param('module_Id') moduleId , @Param('batch_Id') batchId) {
     if ( isNaN(moduleId) ) {
       return My_Helper.FAILED_RESPONSE('module id must be integer')
     }

     if ( isNaN(batchId) ) {
      return My_Helper.FAILED_RESPONSE('batch id must be integer')
    }

    let chapters = await this.chapterService.findChaptersOfModuleInBatch(+moduleId , +batchId );
    return My_Helper.SUCCESS_RESPONSE(chapters);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto ,  ) {
   

  if( Object.keys(updateChapterDto).length > 0 ){
    let updatedChapter = await this.chapterService.update(+id, updateChapterDto );
    return My_Helper.SUCCESS_RESPONSE(updatedChapter); 
  } else {
     return My_Helper.SUCCESS_RESPONSE("no thing to update")
   }

   }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    await this.chapterService.remove(+id);
    return My_Helper.SUCCESS_RESPONSE('chapter removed with success');
  }


   @Get('/of-module=:module_Id/InCurrentBatch')
   async getChapterOfModule (@Param('module_Id') module_Id : string ) {
    if ( isNaN(+module_Id) ) {
      return My_Helper.FAILED_RESPONSE('module id must be integer')
    }      
    return My_Helper.SUCCESS_RESPONSE( await this.chapterService.findAllChaptersOfModuleInCurrentBatch(+module_Id));
    }
 



}
