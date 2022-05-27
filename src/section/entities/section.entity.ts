import { group } from "console";
import { Group } from "src/group/entities/group.entity";
import { Student } from "src/student/student.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Batch } from "src/batch/entities/batch.entity";

@Entity()
@Unique(["name" , "batch"]) 

export class Section { 

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' } )
    name : string;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    
    @ManyToOne(type => Speciality ,{onDelete : "CASCADE" ,onUpdate : 'CASCADE', nullable : true})
    @JoinColumn({name : 'speciality_Id' , referencedColumnName : 'id'})
    speciality : Speciality;
    
    @ManyToOne(type => Batch , {onDelete : "CASCADE" , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'batch_Id' ,referencedColumnName : 'id' })
    batch : Batch;


    @OneToMany(type => Group , group => group.section)
    groups : Group[];

    @OneToMany(type => Student , std => std.section ,
        {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    students : Student[];

 

    
}