import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Sale {
  
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar'  , length : '30' , unique : true})
    name  : string;

    @Column({type : 'int' , unsigned : true})
    capacity : number;

    @Column({type : "boolean", nullable : false , default : 0 })
    hasDataShow : boolean;

    @CreateDateColumn()
    created_at: string;
   
    @UpdateDateColumn()
    updated_at: string;

}
