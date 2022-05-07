import { IsInt } from "class-validator";

export class GetChaptersDto {
    @IsInt()
    module_Id : number ;

    @IsInt()
    batch_Id : number ;
}