import { group } from "console";
import { Group } from "src/group/entities/group.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(["name" , "batch_Id" , "speciality_Id"]) 
export class Section { 

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' } )
    name : string;

    
    @Column({type : 'int' , nullable : false})
    batch_Id : number;
    
    @Column({type : 'int' , nullable : false})
    speciality_Id : number;


    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    
    @OneToMany(type => Group , group => group.section)
    groups : Group[];

    
}