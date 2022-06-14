import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { group } from 'console';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { CreateModuleDto } from './dtos/create-module.dto';
import { updateModuleDto } from './dtos/updateModule.dto';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {

constructor ( private moduleService : ModuleService ) {}

    @Post('/create')
    @UseInterceptors(FileInterceptor('image'))
    async create( @Body() moduleData : CreateModuleDto , @UploadedFile() module_image){         
       let createdModule = await this.moduleService.createModule(moduleData , module_image);
       return My_Helper.SUCCESS_RESPONSE(createdModule);
    }


    @Patch('/update/:id')
    async update(@Param('id') moduleId: number ,  @Body() body : updateModuleDto ) {


        if (isNaN(moduleId)) return 'Id Is not a  number'
        //  let moduelId : number = parseInt(id);

        //  if (!moduelId) throw (new BadRequestException('id must be number'));

       let updatedModule = await this.moduleService.updateModule( moduleId , body);
    return My_Helper.SUCCESS_RESPONSE(updatedModule);
    
    }

    @Delete('/remove/:id')
    async remove ( @Param('id') id : number) { 
       await this.moduleService.remove(id);
        return My_Helper.SUCCESS_RESPONSE('module has been removed with success');
    }

    @Get('/all')
    async list ( ) { 
        let modules = await this.moduleService.listAll();

        return My_Helper.SUCCESS_RESPONSE(modules);
   
    }


    @Get('/OfGroup/:group_Id')
    async listModulesOfGroup (@Param('group_Id') group_Id : number ) { 
        let modules = await this.moduleService.listAll();

        return My_Helper.SUCCESS_RESPONSE(modules);
   
    }



    @Post('/update_image/:module_Id') 
    @UseInterceptors(FileInterceptor('image'))
    async updateImage ( @Param('module_Id') module_Id : number , @UploadedFile() file : Express.Multer.File) { 
      let moduleWithUpdatedImage = await this.moduleService.updateImage(module_Id , file);
      return My_Helper.SUCCESS_RESPONSE(moduleWithUpdatedImage);
    }

    @Get('/images/:module_image')
    async sendModuleImage( @Param('module_image') module_Image , @Res() res ) {
        await this.moduleService.sendModuleImage(module_Image , res );
     }

}
