import { Type } from "class-transformer";
import { IsArray, IsNumberString, IsString, MinLength, ValidateNested } from "class-validator";


export class WriteNewDto {

    @IsNumberString()
    teacher_Id : number;

    @IsString()
    message : string;

    @IsArray()
    @ValidateNested({ each: true })
    @MinLength(1)
    @Type(() => Number)
    groups : number[];


}