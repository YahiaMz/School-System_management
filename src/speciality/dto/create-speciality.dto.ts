import { IsInt, IsNumberString, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateSpecialityDto {
    
    
    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    shortName : string;

    @IsString()
    @IsOptional()
    description : string; 
     

    @IsInt()
    @IsPositive()
    level_Id : number;

}

