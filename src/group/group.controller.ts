import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/create')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get('/all/ofSection=:section_Id')
  async findAll( @Param('section_Id') section_Id : number ) {
    console.log(section_Id);
   let groups = await this.groupService.findAll(section_Id);
   return My_Helper.SUCCESS_RESPONSE(groups);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id ' + id);
    
    return this.groupService.findOne(+id);
  }

  @Patch('/update/:id')
 async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    if (!updateGroupDto.name && !updateGroupDto.section_Id) 
    return My_Helper.SUCCESS_RESPONSE('nothing updated');
    let group =  await this.groupService.update(+id, updateGroupDto);
        return My_Helper.SUCCESS_RESPONSE(group);

  }

  @Delete('/delete/:id')
 async remove(@Param('id') id: string) {
    await this.groupService.remove(+id);
  return My_Helper.SUCCESS_RESPONSE('group removed with success');
  }


  @Get('/group_news/:id')
  async getGroupNews( @Param('id') id : number) { 
    return My_Helper.SUCCESS_RESPONSE(await this.groupService.findGroupNews(id));
  }


}
