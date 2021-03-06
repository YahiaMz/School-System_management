import { type } from "os";
import { Batch } from "src/batch/entities/batch.entity";
import { Module } from "src/module/module.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Level {

    @PrimaryGeneratedColumn()
    id : number ; 

    @Column({type : 'integer' , unsigned : true , unique : true})
    level : number;

    @Column({type:'varchar', nullable : true , unique : true})
    name :string;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    @OneToMany(type => Speciality , spec => spec.level )
    specialities : Speciality[];
    
    @OneToOne(type => Batch , batch => batch.level , {nullable : true})
    currentBatch : Batch;

    @OneToMany(type => Module , mdl => mdl.level )
    modules : Module[];

}


