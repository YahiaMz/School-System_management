import { IsInt, IsPositive, IsString } from "class-validator";

export class CreateGroupDto {

    @IsString()
    name : string;

    @IsInt()
    @IsPositive()
    section_Id : number;

}
