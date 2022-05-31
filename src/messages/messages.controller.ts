import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/create')
  async create(@Body() createMessageDto: CreateMessageDto) {
    let newMessage = await this.messagesService.create(createMessageDto);
    
    return My_Helper.SUCCESS_RESPONSE( newMessage );
  }

  @Get()
  async findAll() {
    let messages = await this.messagesService.findAll();
    return My_Helper.SUCCESS_RESPONSE( messages );
   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
