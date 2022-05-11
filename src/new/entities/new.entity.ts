import { Group } from "src/group/entities/group.entity";
import { Teacher } from "src/teacher/teacher.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name : 'news'})
export class New {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar', nullable : true })
    object : string;

    @Column({type : 'varchar', nullable : false })
    message : string;

    @Column({type : 'varchar' , nullable : true})
    fileUrl : string;

    @Column({type : 'boolean' , default : false})
    approved : boolean;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

    @Column({type : 'datetime' , nullable : true})
    approved_date : string


    @ManyToMany(type => Group , 
        grp => grp.news , 
        {
        onDelete : 'CASCADE' , 
        onUpdate : 'CASCADE'
    })
    @JoinTable({
        name : 'groupsViewNews' , 
        joinColumn: {
            name : 'new_Id', 
            referencedColumnName : 'id'
        } , 
        inverseJoinColumn : {
            name : 'group_Id' ,
            referencedColumnName : 'id'
        }
    })
    groups : Group[];


@ManyToOne(type => Teacher ,{
    onDelete : 'CASCADE' , 
    onUpdate : 'CASCADE'
})
@JoinColumn({
    name : 'teacher_Id'
})
    teacher : Teacher;



}

