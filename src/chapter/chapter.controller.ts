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
@UseInterceptors( FileFieldsInterceptor([
                                         {name : 'lecture_file' , maxCount : 1}  ,
                                         {name : 'td_file' , maxCount : 1} , 
                                         {name:"td_correction_file" , maxCount : 1}
                                        ]))

  async create(@Body() createChapterDto: CreateChapterDto , 
                @UploadedFiles() files : {lecture_file : Express.Multer.File[] , td_file? : Express.Multer.File[] , td_correction_file? : Express.Multer.File[]}  
              ) {

                if ( !files.lecture_file || files.lecture_file.length == 0 || !My_Helper.is_Lecture(files.lecture_file[0].mimetype) ) {
                  return My_Helper.FAILED_RESPONSE('lecture File must be not null and of type {.pdf , .ppt }')
               }

               let mLectureFile = files.lecture_file[0];
              
               if ( files.td_file && files.td_file.length > 0 && !My_Helper.is_Lecture(files.td_file[0].mimetype)){
                return My_Helper.FAILED_RESPONSE('td File must be of type {.pdf , .ppt }');
               }
              let mTdFile = ( files.td_file && files.td_file.length > 0 ) ?  files.td_file[0] : null ;

              
               if ( files.td_correction_file && files.td_correction_file.length > 0 && !My_Helper.is_Lecture(files.td_correction_file[0].mimetype)){
                return My_Helper.FAILED_RESPONSE('td correction must be of type {.pdf , .ppt }');
               }


              let mTdCorrectionFile = ( files.td_correction_file && files.td_correction_file.length > 0 ) ?  files.td_correction_file[0] : null ;




                    let chapter = await this.chapterService.create(createChapterDto ,mLectureFile , mTdFile , mTdCorrectionFile );
                 return My_Helper.SUCCESS_RESPONSE(chapter);
 
  }

  @Get('/all')
  async findAll(@Body() getChaptersDto : GetChaptersDto) {
    let chapters = await this.chapterService.findChaptersOfModule(getChaptersDto.module_Id , getChaptersDto.batch_Id);
    return My_Helper.SUCCESS_RESPONSE(chapters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(+id);
  }

  @Patch('/update/:id')
  @UseInterceptors( FileFieldsInterceptor([
    {name : 'lecture_file' , maxCount : 1}  ,
    {name : 'td_file' , maxCount : 1} , 
    {name:"td_correction_file" , maxCount : 1}
   ]))

  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto ,  @UploadedFiles() files : {lecture_file? : Express.Multer.File[] , td_file? : Express.Multer.File[] , td_correction_file? : Express.Multer.File[]}) {
    
    if ( files.lecture_file && files.lecture_file.length > 0 && !My_Helper.is_Lecture(files.lecture_file[0].mimetype) ) {
      return My_Helper.FAILED_RESPONSE('lecture File must of type {.pdf , .ppt }')
    }
   let uLectureFile = (files.lecture_file && files.lecture_file.length > 0) ? files.lecture_file[0] : null;
   
   if ( files.td_file && files.td_file.length > 0 && !My_Helper.is_Lecture(files.td_file[0].mimetype)){
    return My_Helper.FAILED_RESPONSE('td File must be of type {.pdf , .ppt }');
   }
  let uTdFile = ( files.td_file && files.td_file.length > 0 ) ?  files.td_file[0] : null ;
   
  if ( files.td_correction_file && files.td_correction_file.length > 0 && !My_Helper.is_Lecture(files.td_correction_file[0].mimetype)){
    return My_Helper.FAILED_RESPONSE('td correction must be of type {.pdf , .ppt }');
   }
  let uTdCorrectionFile = ( files.td_correction_file && files.td_correction_file.length > 0 ) ?  files.td_correction_file[0] : null ;



  if( uLectureFile || uTdFile || uTdCorrectionFile || Object.keys(updateChapterDto).length > 0 ){
    let updatedChapter = await this.chapterService.update(+id, updateChapterDto , uLectureFile , uTdFile , uTdCorrectionFile);
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


  @Get('/files/:lecture_name')
  async getLectureFile (@Param('lecture_name') lecture_name : string , @Res() res) {
     return this.chapterService.sendLecturesFiles(lecture_name , res );
   }


   @Get('/OfModule/:module_Id')
   async getChapterOfModule (@Param('module_Id') module_Id : string ) {
     console.log(module_Id);
     
      return  await this.chapterService.findAllChaptersOfModule(+module_Id);
    }
 



}
