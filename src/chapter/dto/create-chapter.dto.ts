import { IsInt, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateChapterDto {

    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumber()
    module_Id : number;


}
