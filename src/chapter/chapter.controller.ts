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
                @UploadedFiles() files : {lecture_file : Express.Multer.File , td_file : Express.Multer.File , td_correction_file : Express.Multer.File}  
              ) {
                                
    let chapter = await this.chapterService.create(createChapterDto , files['lecture_file'][0] , files['td_file'][0] , files['td_correction_file'][0] );
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(+id, updateChapterDto);
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



}
