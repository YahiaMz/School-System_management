import { Module } from "src/module/module.entity";
import { Student } from "src/student/student.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['student' , 'module'])
export class Mark {

    @PrimaryGeneratedColumn()
    id:number;


    @Column({type : 'tinyint' , nullable : false , default : 1 })
    semester : number;

    @Column({type : 'double' , unsigned : true , nullable : true ,default : null})
    emd1 : number ;

    @Column({type : 'double' , unsigned : true , nullable : true ,default : null})
    emd2 : number ;
    
    @Column({type : 'double' , unsigned : true , nullable : true ,default : null})
    cc : number ;

    @ManyToOne(type => Student , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'student_Id' , referencedColumnName : 'id'})
    student : Student;

    @ManyToOne(type => Module , {nullable : false , onDelete :'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'module_Id' , referencedColumnName : 'id'})
    module : Module;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    
}
