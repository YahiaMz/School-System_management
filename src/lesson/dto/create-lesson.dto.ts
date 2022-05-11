import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {

    @IsInt()
    day : number;

    @IsString()
    @IsIn(["COURS" , "TD" , "TP"])
    lesson_Type : string ;

    @IsString()
    startingTime : string; 

    @IsString()
    endingTime : string;

    @IsInt()
    sale_Id : number;

    @IsInt()
    teacher_Id : number;

    @IsInt()
    @IsOptional()
    group_Id : number;

    @IsInt()
    module_Id : number;


    @IsInt()
    section_Id : number;
}
