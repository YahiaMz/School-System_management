import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { ChapterFileService } from './chapter-file.service';
import { CreateChapterFileDto } from './dto/create-chapter-file.dto';
import { UpdateChapterFileDto } from './dto/update-chapter-file.dto';

@Controller('chapter-files')
export class ChapterFileController {
  constructor(private readonly chapterFileService: ChapterFileService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createChapterFileDto: CreateChapterFileDto , @UploadedFile() file : Express.Multer.File) {
    
     if ( !file || !My_Helper.is_Lecture(file.mimetype) ) {
       return My_Helper.FAILED_RESPONSE('File must be not null and of type {.pdf}')
    }
    
    return My_Helper.SUCCESS_RESPONSE( await this.chapterFileService.create(createChapterFileDto , file));
  }

  @Get('/all/ofChapter/:chapterId')
  async findAllFilesOfChapter( @Param('chapterId') chapter_Id : number) {
    let files = await this.chapterFileService.find_All_files_of_chapter(chapter_Id);
    return My_Helper.SUCCESS_RESPONSE(files);
  }

  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('file'))

  async update(@Param('id') id: string, @Body() updateChapterFileDto: UpdateChapterFileDto , @UploadedFile() nFile : Express.Multer.File) {
  
    if(!updateChapterFileDto.fileName && !nFile) {
      return My_Helper.FAILED_RESPONSE("something wrong");
    }
  
    let udatedCfile =  await this.chapterFileService.update(+id, updateChapterFileDto.fileName , nFile);
    return My_Helper.SUCCESS_RESPONSE(udatedCfile);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    await this.chapterFileService.remove(+id);
    return My_Helper.SUCCESS_RESPONSE("chapter File removed with success ");

  }

  @Get('/:file_Url')
  async sendModuleImage( @Param('file_Url') fileUrl , @Res() res ) {
      await this.chapterFileService.sendChapterFileName(fileUrl , res );
   }


}
