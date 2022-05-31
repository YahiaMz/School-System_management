import { IsBoolean, IsIn, IsInt, IsString } from "class-validator";

export class CreateSaleDto {

    @IsString()
    name : string ;

    @IsInt()
    capacity : number;

    @IsBoolean()
    hasDataShow : boolean;
    
    @IsBoolean()
    hasNetworkEquipment : boolean;

    @IsString()
    @IsIn(['CPI' , 'CS'])
    area : string;

    @IsString()
    @IsIn(['TD' , 'TP' , 'AMPHI'])
    roomType : string;
    

}
