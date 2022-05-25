import { IsInt, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateChapterDto {

    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumberString()
    batch_Id : number;

    @IsNumberString()
    module_Id : number;

    

}
