import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNumber, IsNumberString, IsString, MinLength, ValidateNested } from "class-validator";
import { isInt8Array } from "util/types";

export class CreateNewDto 
{

@IsNumberString()
teacher_Id : number;

 @IsString()
 message : string;


 @IsArray()
 @Type(type => Number)
 @ArrayMinSize(1)
 groups : number[]

}
