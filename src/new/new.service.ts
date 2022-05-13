import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Teacher } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { New } from './entities/new.entity';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class NewService {
  
  
  constructor (
     @InjectRepository(New) private newsRepository : Repository<New> , 
     @InjectRepository(Group) private groupRepo : Repository<Group> , 
     @InjectRepository(Teacher) private teacherRepo : Repository<Teacher> , 
  ){ 

  }



 // remember you will not use function in the News Controller  
private async findGroupByIdOrThrowExp ( id : number ) : Promise<Group> {
  try {
    let group = await this.groupRepo.findOne({id : id});
    if (group) return group;
  } catch (error) {
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201);
  }

  throw new HttpException(My_Helper.FAILED_RESPONSE(`group with id = ${id} not found`) , 201);

}


// remember just for the relation 
private async findTeacherByIdOrThrowExp ( teacher_Id : number) {
  try {
    let teacher = await this.teacherRepo.findOne({
      select : ['id' , 'name' , 'lastName' ,'email', 'profileImage' , 'dateOfBirth'] ,
      where : {
        id : teacher_Id
      }
      });
    if(teacher) return teacher;
  } catch (error) {
    throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong !') , 201);
  }
  throw new HttpException(My_Helper.FAILED_RESPONSE(`teacher not found`) , 201);


}


  async create(createNewDto: CreateNewDto , file : Express.Multer.File) {


    console.log(file);
    

    let teacher = await this.findTeacherByIdOrThrowExp(createNewDto.teacher_Id);
    let mGroups:Group[] = [];
// finding the groups 
   for (let x = 0 ; x<createNewDto.groups.length; x ++) { 
       let group = await this.findGroupByIdOrThrowExp(createNewDto.groups[x]);
       mGroups.push(group)
     }
// groups are founded

    try { 
    let mNew = await this.newsRepository.create({message : createNewDto.message , object :createNewDto.object});
     mNew.groups = mGroups;
     mNew.teacher = teacher;
     

     if (file){



     let fileExtinction = My_Helper.fileExtinction(file.mimetype);
     let fileName = 'news_'+ uuidv4() + fileExtinction ;
     let filePath = My_Helper.newsFiles+fileName;


    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    
    mNew.fileUrl = fileName;
    }

     return await this.newsRepository.save(mNew);
    
    } catch (error) {
      console.log(error.message);
      
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong while creating new!') , 201);
    }

  }

  // get all the news of a group 
  async findAllNewsOf_a_Group ( group_id : number ) {
    
    let group = await this.findGroupByIdOrThrowExp(group_id);
    try {
      
      
      let newsOfThisGroup =  await this.newsRepository.
      query(
        `SELECT id AS newsId ,group_Id ,object, message , fileUrl , teacher_Id , created_at , approved_date
        FROM groupsViewNews INNER JOIN news ON groupsViewNews.new_Id = news.id
        WHERE approved AND groupsViewNews.group_Id = ${group_id} ORDER BY news.created_at desc ;`

        )
      
      for ( let x = 0 ; x < newsOfThisGroup.length ; x ++){
        let teacher = await this.findTeacherByIdOrThrowExp(newsOfThisGroup[x].teacher_Id);
        
        newsOfThisGroup[x]['sender'] = teacher;
        delete newsOfThisGroup[x].teacher_Id;
      
      }
      return newsOfThisGroup;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }

}

// this function is private because you're using it to help you not for the controller
private async  findNewByIdOrThrow_Exp ( id: number) {
      try {
        let mNew = await this.newsRepository.findOne({id : id});
        if (mNew) return mNew;
      } catch (error) {
        throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
      }
      throw new HttpException(My_Helper.FAILED_RESPONSE('new not found') , 201);

     
  }

  async update(id: number, updateNewDto: UpdateNewDto) {
    let mNew = await this.findNewByIdOrThrow_Exp(id);
    Object.assign(mNew , updateNewDto);
     
    return await this.newsRepository.save(mNew);
  }

  async remove(id: number) {
    let newToRemove = await this.findNewByIdOrThrow_Exp(id);
    await this.newsRepository.remove(newToRemove);
  }


// approve New is function just for admin , so dont forget to A guard For it
  async approveNew ( new_Id : number) { 
    let mNew = await this.findNewByIdOrThrow_Exp(new_Id);
     mNew.approved = true;
     mNew.approved_date = new Date(Date.now()).toLocaleString();     ;
    return await this.newsRepository.save(mNew);
  }
  
  async getNewFile(file_name : string , @Res() res) { 
    try {
      let file  =await res.sendFile(join(process.cwd() , My_Helper.newsFiles + file_name));
      return file;   
     } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('file not found') , 201);
    }
  }


  // all new News to displaying it to the admin 
  public async news_To_Approve ( ) { 
     try {
       let newsToApprove = await this.newsRepository.query(
         ` SELECT news.id as new_Id , message ,object, fileUrl , teacher_Id , news.created_at FROM 
           news inner join teacher  ON teacher.id = news.teacher_Id 
           WHERE approved = false order by news.created_at; 
         `);

         for ( let x : number = 0 ; x<newsToApprove.length ; x ++) { 
           let teacher = await this.findTeacherByIdOrThrowExp(newsToApprove[x].teacher_Id);
           
           newsToApprove[x]['teacher'] = teacher;
           delete newsToApprove[x].teacher_Id;
          }

      return newsToApprove;
     } catch (error) {
       console.log(error.message);
       
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
     } 
  }


    // all new News to displaying it to the admin 
    public async approvedNews ( ) { 
      try {
        let newsToApprove = await this.newsRepository.query(
          ` SELECT news.id as new_Id , message ,object, fileUrl , teacher_Id , news.created_at FROM 
            news inner join teacher  ON teacher.id = news.teacher_Id 
            WHERE approved = true order by news.approved_date; 
          `);
 
          for ( let x : number = 0 ; x<newsToApprove.length ; x ++) { 
            let teacher = await this.findTeacherByIdOrThrowExp(newsToApprove[x].teacher_Id);
            
            newsToApprove[x]['teacher'] = teacher;
            delete newsToApprove[x].teacher_Id;
           }
 
       return newsToApprove;
      } catch (error) {
        console.log(error.message);
        
       throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
      } 
   }
 




}
