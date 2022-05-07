import { Section } from "src/section/entities/section.entity";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";

@Entity()
@Unique(["name" , "section" , "semester"])
export class Timetable {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "int" , unsigned : true })
    semester : number;

    @Column( {type : 'varchar' } )
    name : string;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    @ManyToOne( type => Section , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({ name : 'section_Id'})
    section : Section;

}
