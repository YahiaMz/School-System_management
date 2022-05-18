import { IsInt, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateModuleDto {

    @IsNumber()
    level_Id : number;


    @IsNumber()
    @IsOptional()
    speciality_Id : number;


    @IsInt()
    @Max(2)
    @Min(1)
    semester : number;

    @IsString()
    name : string;

    @IsInt()
    coef : number;

      
    @IsString( )
    shortName : string;

    @IsString()
    description : string;

    
}