import { group } from "console";
import { Group } from "src/group/entities/group.entity";
import { Student } from "src/module/student.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(["name" , "batch_Id" , "speciality_Id" ]) 

export class Section { 

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' } )
    name : string;

    @Column({type : 'int' , nullable : false})
    batch_Id : number;
    
    @Column({type : 'int' , nullable : true})
    speciality_Id : number;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    
    @OneToMany(type => Group , group => group.section)
    groups : Group[];

    @OneToMany(type => Student , std => std.section ,
        {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
   students : Student[];

    
}