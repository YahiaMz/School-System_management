import { Level } from "src/level/entities/level.entity";
import { Student } from "src/student/student.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TableForeignKey, UpdateDateColumn } from "typeorm";

@Entity()
export class Batch {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' , nullable : true})
    name : string;

    @Column({type:'integer' , unsigned : true , unique : true})
    year : number;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;


    @OneToOne(type => Level , {nullable : true , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'level_Id'} )
    level : Level;

    @OneToMany(type => Student , std => std.batch ,
         {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    students : Student[];


}
