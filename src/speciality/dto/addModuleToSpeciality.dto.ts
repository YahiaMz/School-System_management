import { IsInt, IsNumberString, Max, Min } from "class-validator";

export class AddModuleToSpecialityDto { 

    @IsInt()
    speciality_Id : number;

    @IsInt()
    module_Id : number;

    @IsInt()
    coef : number;



}