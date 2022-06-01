import { IsInt, IsNumberString, IsString } from "class-validator";

export class CreateChapterFileDto {

    @IsString()
    fileName : string ;

    @IsNumberString()
    chapter_Id : number;

}
