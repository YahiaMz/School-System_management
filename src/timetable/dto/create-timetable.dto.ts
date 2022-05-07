import { IsIn, IsInt, IsString, Max, Min } from "class-validator";

export class CreateTimetableDto {

    @IsString()
    name : string;

    @IsInt()
    @Max(2)
    @Min(1)
    semester : number;

    @IsInt()
    section_Id : number;


}
