import { IsInt, IsNumberString, IsString, Max, Min } from "class-validator";

export class CreateModuleDto {

    @IsNumberString()
    level_Id : number;

    @IsInt()
    @Max(2)
    @Min(1)
    semester : number;

    @IsString()
    name : string;
      
    @IsString( )
    shortName : string;

    @IsString()
    description : string;

    
}