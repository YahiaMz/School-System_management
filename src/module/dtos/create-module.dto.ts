import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateModuleDto {

    @IsInt()
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