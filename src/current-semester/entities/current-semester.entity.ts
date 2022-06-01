import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class CurrentSemester {

    @PrimaryColumn({type : 'enum' ,
    enum : [1],
    unique : true,
    default : 1
})
    id : number;


    @Column({type : "enum" , 
     enum : [1 , 2] , 
     default : 1 ,
     nullable : false
     })
     current_semester : number;
    

}