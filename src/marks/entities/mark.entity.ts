import { Module } from "src/module/module.entity";
import { Student } from "src/student/student.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Mark {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type : 'int' , unsigned : true , nullable : true ,default : null})
    emd1 : number ;

    @Column({type : 'int' , unsigned : true , nullable : false ,default : null})
    emd2 : number ;
    
    @Column({type : 'int' , unsigned : true , nullable : true ,default : null})
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
