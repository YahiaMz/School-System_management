import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateSectionDto {


    @IsInt()
    @IsPositive()
    batch_Id : number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    speciality_Id : number;

    @IsString()
    name : string;

    
}