import { IsInt, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateModuleDto {

    @IsNumberString()
    level_Id : number;


    @IsNumberString()
    @IsOptional()
    speciality_Id : number;


    @IsNumberString()
    semester : number;

    @IsString()
    name : string;

    @IsNumberString()
    coef : number;

      
    @IsString( )
    shortName : string;

    @IsString()
    description : string;

    
}