import { group } from "console";
import { type } from "os";
import { Batch } from "src/batch/entities/batch.entity";
import { Group } from "src/group/entities/group.entity";
import { Level } from "src/level/entities/level.entity";
import { Section } from "src/section/entities/section.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Column, Entity, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";



@Entity({

})
export class Student{
 
    @PrimaryGeneratedColumn({type : 'bigint'})
    id : number;

    @Column({nullable : false})
    name : string ;

    @Column({type : 'varchar',  nullable :false })
    lastName : string;

    @Column({type :'varchar' , unique : true})
    email : string;
 
    @Column({type : 'varchar'})
    password : string;

    @Column({type:"date" , nullable : true} )
    dateOfBirth : string;

    @Column({type:"varchar" , nullable:true})
    profileImage : string;

    @Column({type : 'varchar' , nullable : true ,length : 30})
    wilaya : string;

    @CreateDateColumn()
    created_at: Date;
   
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => Batch  , batch => batch.students ,{nullable : false , onDelete : "CASCADE" , onUpdate : "CASCADE" })
    @JoinColumn({name : 'batch_Id'})
    public batch : Batch;

 
    @ManyToOne(type => Speciality  , {nullable : true , onDelete : "CASCADE" , onUpdate : "CASCADE" })
    @JoinColumn({name : 'speciality_Id'})
    public speciality : Speciality;   


    @ManyToOne(type => Section  , {nullable : false , onDelete : "CASCADE" , onUpdate : "CASCADE" })
    @JoinColumn({name : 'section_Id'})
    public section : Section;

    @ManyToOne  ( type => Group   , group=> group.students,  {nullable : false , onDelete:'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn ( { name : 'group_Id' } )
    public group : Group;



}