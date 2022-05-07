import { IsBoolean, IsInt, IsString } from "class-validator";

export class CreateSaleDto {

    @IsString()
    name : string ;

    @IsInt()
    capacity : number;

    @IsBoolean()
    hasDataShow : boolean;
}
