import { Level } from "src/level/entities/level.entity";
import { Speciality } from "src/speciality/entities/speciality.entity";
import { Unique, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from "./batch.entity";

@Entity()
@Unique(["in_level" , "speciality" , "batch"])
export class Batches_has_many_specialities {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => Level , {nullable :false, onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'level_Id' , referencedColumnName : 'id'})
    public in_level : Level;

    @ManyToOne(type => Speciality , {nullable :false ,onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'speciality_Id'})
    public speciality : Speciality;

    @ManyToOne(type => Batch , {nullable :false,onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name : 'batch_Id'})
    public batch : Batch;

    
} 