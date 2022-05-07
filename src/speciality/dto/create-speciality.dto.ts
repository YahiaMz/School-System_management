import { IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateSpecialityDto {
    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    shortName : string;

    @IsString()
    @IsOptional()
    description : string; 
     

}

