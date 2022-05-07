import { Level } from "src/level/entities/level.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Module { 



    @PrimaryGeneratedColumn({type:'integer'})
    id : number;

    @Column({type : 'tinyint'})
    semester : number;

    @Column({type:"varchar" , unique : true})
    name : string;

    @Column({type : 'varchar' , nullable : true} , )
    shortName : string; 

    @Column({type : 'varchar'})
    description : string;

    @Column({type:'varchar' , nullable : true})
    imageUrl : string;

    @CreateDateColumn({type:'datetime'})
    created_at : string;

    @UpdateDateColumn({type :'datetime'})
    updated_at : string;


    @ManyToOne(type => Level , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'level_Id' })
    level : Level;


}