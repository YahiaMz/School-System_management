import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { NewService } from './new.service';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { group } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewDtoByAdmin } from './dto/create-new-byAdmin.dto';

@Controller('news')
export class NewController {
  constructor(private readonly newService: NewService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createNewDto: CreateNewDto , @UploadedFile() file : Express.Multer.File) {

     let newNew = await this.newService.create(createNewDto , file);
     return My_Helper.SUCCESS_RESPONSE( newNew);  


    }



  @Post('/CreateByAdmin')
  @UseInterceptors(FileInterceptor('file'))
  async createByAdmin(@Body() createNewDtoByAdmin: CreateNewDtoByAdmin , @UploadedFile() file : Express.Multer.File) {

     let newNewByAdmin = await this.newService.createByAdmin( createNewDtoByAdmin, file);
     return My_Helper.SUCCESS_RESPONSE(newNewByAdmin);  


    }

  @Get('/ofGroup/:group_Id')
  async findAllNewsOfGroup(@Param('group_Id') group_Id : number) { 
       console.log(group_Id);
    let news = await this.newService.findAllNewsOf_a_Group(group_Id);
  return My_Helper.SUCCESS_RESPONSE(news);
  }


  @Get('/sentByAdmin')
  async findNewsSentByAdmin() { 
    let news = await this.newService.NewsSentByAdmin();
  return My_Helper.SUCCESS_RESPONSE(news);
  }


  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateNewDto: UpdateNewDto) {
    return My_Helper.SUCCESS_RESPONSE( await this.newService.update(+id, updateNewDto) );
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    await this.newService.remove(+id);
  return My_Helper.SUCCESS_RESPONSE('new removed with success ')
  }



  @Get('/approve/:new_Id')
  async approveNew( @Param('new_Id')new_Id : number) { 
   
   let approved_new = await this.newService.approveNew(new_Id);
   return My_Helper.SUCCESS_RESPONSE(approved_new );
  
  }


  @Get('/files/:file_name')
  async sendFileName( @Param('file_name') file_name : string , @Res() res ) {
    await this.newService.getNewFile(file_name , res);
   }

  
   // get the new 'News' for admin to approve 
   @Get('/news_to_approve')
   async newsToApprove ( ) {
      let newsToApprove = await this.newService.news_To_Approve();
      
      return My_Helper.SUCCESS_RESPONSE( newsToApprove );
    }

    // get the new approved 'News' by admin   
   @Get('/approvedNews')
   async getApprovedNews ( ) {
      let approvedNews = await this.newService.approvedNews();
      return My_Helper.SUCCESS_RESPONSE( approvedNews );
    }


}
