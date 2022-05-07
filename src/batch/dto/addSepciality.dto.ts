import { IsIn, IsInt} from "class-validator";


export class AddSepcialityDto { 
    @IsInt()
    batch_Id : number;

    @IsInt()
    speciality_Id : number;

    @IsInt()
    level_Id : number;

}