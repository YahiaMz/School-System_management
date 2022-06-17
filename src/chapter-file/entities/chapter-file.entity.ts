import { IsString } from "class-validator";
import { Chapter } from "src/chapter/entities/chapter.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['name','chapter'])
export class ChapterFile {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type : 'varchar' , nullable : false })
    name : string

    @Column({type : 'varchar' , nullable : false} )
    fileUrl : string;

    @ManyToOne(type => Chapter , {onDelete:'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'chapter_Id'})
    chapter : Chapter;

    @CreateDateColumn()
    created_at : string;

    @UpdateDateColumn()
    updated_at : string;



}
