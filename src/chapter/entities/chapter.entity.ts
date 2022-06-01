import { Batch } from "src/batch/entities/batch.entity";
import { ChapterFile } from "src/chapter-file/entities/chapter-file.entity";
import { Module } from "src/module/module.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({name : 'chapters'})
@Unique(['name','batch','module'])
export class Chapter {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' , length : 100})
    name : string;

    @Column({type : 'varchar' , length : 800 , nullable : true})
    description : string;

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


    @OneToMany(type => ChapterFile , cFile => cFile.chapter , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    files : ChapterFile[];

}

