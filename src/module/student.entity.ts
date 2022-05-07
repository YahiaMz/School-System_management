import { group } from "console";
import { type } from "os";
import { Group } from "src/group/entities/group.entity";
import { Column, Entity, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";



@Entity({

})
export class Student{
 
    @PrimaryGeneratedColumn({type : 'bigint'})
    id : number;

    @Column({nullable : false})
    name : string ;

    @Column({type : 'varchar',  nullable :false })
    lastName : string;

    @Column({type :'varchar' , unique : true})
    email : string;
 
    @Column({type : 'varchar'})
    password : string;

    @Column({type:"date" , nullable : true} )
    dateOfBirth : string;

    @Column({type:"varchar" , nullable:true})
    profileImage : string;

    @Column({type : 'varchar' , nullable : true ,length : 30})
    wilaya : string;

    @CreateDateColumn()
    created_at: Date;
   
   @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne  ( type => Group   , group=> group.students,  {nullable : true , onDelete:'SET NULL' , onUpdate : 'SET NULL'} )
    @JoinColumn ( { name : 'group_Id' } )
    public group : Group;


}