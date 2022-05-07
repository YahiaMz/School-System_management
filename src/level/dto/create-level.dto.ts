import { IsInt, IsString } from "class-validator";

export class CreateLevelDto {

    @IsInt()
    level : number;
    
    @IsString()
    name  : string;




}
