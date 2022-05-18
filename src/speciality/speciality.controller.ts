import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { AddModuleToSpecialityDto } from './dto/addModuleToSpeciality.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post('/create' ) 
  @UseInterceptors(FileInterceptor('image'))
 async create(@Body() createSpecialityDto: CreateSpecialityDto , @UploadedFile() speciality_Image : Express.Multer.File) {
   let speciality = await this.specialityService.create(createSpecialityDto , speciality_Image );
   return My_Helper.SUCCESS_RESPONSE(speciality);
  }

 
  @Get('/images/:image_name')
  async getSpecialityImage( @Param('image_name') imageName , @Res() res) {
      await this.specialityService.sendImage(imageName , res);    
   }


  @Get('/all')
  async findAll() {
    let specialities = await this.specialityService.findAll();
   return My_Helper.SUCCESS_RESPONSE(specialities);
  }

  @Get('/:id')
  async findOne(@Param('id') specility_Id: string) {
    let speciality = await this.specialityService.findOne(+specility_Id);
    return My_Helper.SUCCESS_RESPONSE(speciality);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateSpecialityDto: UpdateSpecialityDto) {
    
    let spec = await  this.specialityService.update(+id, updateSpecialityDto);
    return My_Helper.SUCCESS_RESPONSE(spec);
  }

  @Delete('/delete/:id')
 async remove(@Param('id') id: string) {
    await this.specialityService.remove(+id);
    return My_Helper.SUCCESS_RESPONSE('speciality has been removed with success :)')
  
  }


@Post('update_image/:id')
@UseInterceptors(FileInterceptor('image'))
async updateImage(  @Param('id') id ,@UploadedFile() image : Express.Multer.File ) {
  let updatedSpeciality = await this.specialityService.updateSpecialityImage(id , image);
 return My_Helper.SUCCESS_RESPONSE(updatedSpeciality); 
}


}
