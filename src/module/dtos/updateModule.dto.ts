import { IsNumberString, IsOptional, IsString } from "class-validator";


export class updateModuleDto {

    @IsOptional()    
    @IsNumberString()
    level_Id : number;

    @IsOptional()
    @IsNumberString()
    semester : number;

    @IsOptional()
    @IsString()
    name : string;
      
    @IsOptional()
    @IsString( )
    shortName : string;

    @IsOptional()
    @IsString()
    description : string;

    @IsOptional()
    @IsString()
    imageUrl : string;
    
}