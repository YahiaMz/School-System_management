import { Admin } from "src/admin/entities/admin.entity";
import { Batch } from "src/batch/entities/batch.entity";
import { Group } from "src/group/entities/group.entity";
import { Student } from "src/student/student.entity";
import { Teacher } from "src/teacher/teacher.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type : 'varchar' , nullable : true })
    message :string ;

    @Column({type : "varchar" , nullable : true})
    fileUrl : string;


    @ManyToOne(type => Group , {onDelete : 'CASCADE' , onUpdate : "CASCADE", nullable : true })
    @JoinColumn({
        name : 'group_Id', 
         referencedColumnName : 'id',
    })
    group : Group;


    @Column({type : 'int' , unsigned : true})
    senderType : number;


    @ManyToOne(type => Admin , {onDelete : 'CASCADE' , onUpdate : "CASCADE", nullable : true })
    @JoinColumn({
        name : 'admin_Id', 
         referencedColumnName : 'id',
    })
    admin : Admin;
    

    @ManyToOne(type => Teacher , {onDelete : 'CASCADE' , onUpdate : "CASCADE", nullable : true })
    @JoinColumn({
        name : 'teacher_Id', 
         referencedColumnName : 'id',
    })
    teacher : Teacher;
    


    @ManyToOne(type => Student , {onDelete : 'CASCADE' , onUpdate : "CASCADE", nullable : true })
    @JoinColumn({
        name : 'student_Id', 
         referencedColumnName : 'id',
    })
    student : Student;
    


    @ManyToOne(type => Batch , {onDelete : 'CASCADE' , onUpdate : "CASCADE", nullable : true  })
    @JoinColumn({
        name : 'batch_Id', 
         referencedColumnName : 'id',
    })
    Batch : Batch;
    

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

}
