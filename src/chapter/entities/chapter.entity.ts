import { Batch } from "src/batch/entities/batch.entity";
import { Module } from "src/module/module.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : 'chapters'})
export class Chapter {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' , length : '40'})
    name : string;

    @Column({type : 'varchar' , length : '500' , nullable : true})
    description : string;

    @Column({type : 'varchar' , nullable : false})
    lecture_file : string;

    @Column({type : 'varchar' , nullable : true})
    td1_file : string;
    
    @Column({type : 'varchar' , nullable : true})
    td2_file : string;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    @ManyToOne(type => Batch , {onDelete :'CASCADE' , onUpdate  : 'CASCADE'})
    @JoinColumn({
        name : 'batch_Id'
    })
    batch : Batch;

    @ManyToOne(type => Module , {onDelete :'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'module_Id' })
    module : Module;


}

