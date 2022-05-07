import { Module } from "src/module/module.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Speciality } from "./speciality.entity";


@Entity()
export class SpecialityHasManyMoudules { 

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type:'tinyint' , unsigned : true , nullable : false })
    coef : number;
    

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;


    // relations :: 

    @ManyToOne(type => Speciality , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
@JoinColumn({name : 'speciality_Id'}  )
    speciality : Speciality;


    @ManyToOne(type => Module ,{onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'module_Id'})
    module : Module ;



}