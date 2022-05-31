import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { BatchService } from 'src/batch/batch.service';
import { GroupService } from 'src/group/group.service';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  constructor(@InjectRepository(Message) private messageRepository : Repository<Message> , 
  private groupService : GroupService , 
  private teacherService : TeacherService , 
  private adminService : AdminService ,
  private batchService : BatchService , 
  private studentService : StudentService

  ) { }

  async create(createMessageDto: CreateMessageDto) {

    let batch = await this.batchService.findBatchByIdOrThrow_Exp(createMessageDto.batch_Id);
    
    let newMessage = this.messageRepository.create({
       message : createMessageDto.message ,  
       Batch : batch  ,
       senderType : createMessageDto.senderType
    });
    if(createMessageDto.senderType === 2) {
      let teacher = await this.teacherService.findTeacherByIdOrThrowExp(createMessageDto.sender_Id);
      newMessage.teacher = teacher;
      newMessage.student = null ; 
      newMessage.admin = null;
    }

    if(createMessageDto.senderType === 3) {
      let student = await this.studentService.findStudentByIdOrThrowException(createMessageDto.sender_Id);
      newMessage.student = student;
      newMessage.teacher = null ; 
      newMessage.admin = null;
    }

    if(createMessageDto.group_Id) {
      let group = await this.groupService.findGroupByIdOrThrowExp(createMessageDto.group_Id);
      newMessage.group = group;
      newMessage.Batch =null;
    } 


  try {
   return await this.messageRepository.save(newMessage);
  } catch (error) {
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ! , { '+error.message+' }') , 201);
  }
  }

  async findAll() {
 try {
   let messages = await this.messageRepository.find();
   return messages
 } catch (error) {
  throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong ! , { '+error.message+' }') , 201);
 }

  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
