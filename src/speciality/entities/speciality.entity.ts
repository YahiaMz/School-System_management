import { trace } from "console";
import { Level } from "src/level/entities/level.entity";
import { Module } from "src/module/module.entity";
import { Student } from "src/student/student.entity";
import { Column, CreateDateColumn, Entity,  JoinColumn,  ManyToOne,  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Speciality 
{
    @PrimaryGeneratedColumn({type : 'bigint' , unsigned : true})
    id : number;

    @Column({type : 'varchar' ,length : 50 , unique : true , nullable : false})
    name : string;

    @Column({type:'varchar' , nullable : true , length : 20 })
    shortName : string;

    @Column({type : 'varchar', nullable : true , length: 500} )
    description : string; 

    @Column({type : 'varchar' , nullable : true})
    imageUrl : string;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    @OneToMany(type => Module , mdl => mdl.speciality , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    modules : Module[];

    @OneToMany(type => Student , std => std.speciality ,
        {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    students : Student[];


    @ManyToOne(type => Level , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'level_Id'})
    public level : Level;



}
