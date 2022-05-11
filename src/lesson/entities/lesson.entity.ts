import { Group } from "src/group/entities/group.entity";
import { Module } from "src/module/module.entity";
import { Sale } from "src/sale/entities/sale.entity";
import { Section } from "src/section/entities/section.entity";
import { Teacher } from "src/teacher/teacher.entity";
import { Timetable } from "src/timetable/entities/timetable.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Check(`"day" > 0 and "day < 6"`)
@Check(`"lesson_Type" = "TD" or "lesson_Type" = "TP" , "lesson_Type" = "COURS"`)
@Unique(["day" , "teacher" , "startingTime" , "module"])
@Unique(["day" , "sale" , "group" , "startingTime"])
export class Lesson {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type :'tinyint' , unsigned : true})
    day : number;
  

    @Column({type :'varchar' , length : '10'})
    lesson_Type : string;
 // lessonType =  ( lessonType )? TD , COURS 

    @Column({type : 'time'})
     startingTime : string;

     @Column({type : 'time'})
     endingTime : string;


    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;


    @ManyToOne(type =>Section , { onDelete : 'CASCADE' , onUpdate : "CASCADE"})
    @JoinColumn({name: 'section_Id'})
    section : Section;

    
    @ManyToOne(type => Sale , { nullable : false , onDelete : 'CASCADE' , onUpdate : "CASCADE"})
    @JoinColumn(
        {
            name : 'sale_Id'
        }
    )
    sale : Sale;


    @ManyToOne(type => Teacher , { nullable :false ,  onDelete: 'CASCADE'  , onUpdate : 'CASCADE'})
    @JoinColumn({
        name : 'teacher_Id'
    })
    teacher : Teacher;


    @ManyToOne(type => Group , { nullable : true ,  onDelete: 'CASCADE'  , onUpdate : 'CASCADE'})
    @JoinColumn({
        name : 'group_Id'
    })
    group : Group;


    @ManyToOne(type => Module , { nullable : false , onDelete: 'CASCADE'  , onUpdate : 'CASCADE'})
    @JoinColumn({
        name : 'module_Id'
    })
    module: Module;


}
