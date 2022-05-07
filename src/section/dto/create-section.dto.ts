import { IsInt, IsPositive, IsString } from "class-validator";

export class CreateSectionDto {


    @IsInt()
    @IsPositive()
    batch_Id : number;

    @IsInt()
    @IsPositive()
    speciality_Id : number;

    @IsString()
    name : string;

    
}