import { group } from "console";
import { Student } from "src/module/student.entity";
import { New } from "src/new/entities/new.entity";
import { Section } from "src/section/entities/section.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()

@Unique(["name" , "section"])
export class Group {

@PrimaryGeneratedColumn( )
id : number;

@Column({type : 'varchar' , length : 20})
name : string;

@Column({type : 'integer' , unsigned : true , nullable : true})
capacity : number;

@CreateDateColumn()
created_at: string;

@UpdateDateColumn()
updated_at: string;

@ManyToOne(type=> Section , { onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
@JoinColumn({ name : 'section_Id' } )
section : Section; 


@ManyToMany(type => New , 
    mNew => mNew.groups ,  
    {
    onDelete : 'CASCADE' , 
    onUpdate : 'CASCADE'
})
news  :New[];


@OneToMany(type => Student  , Student => Student.group )
students : Student[];



}
