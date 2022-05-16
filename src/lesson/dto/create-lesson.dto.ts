import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateLessonDto {

    @IsInt()
    @Max(5)
    @Min(1)
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

    @IsInt()
    @Max(2)
    @Min(1)
    semester : number;

    
}
