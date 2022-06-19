import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class CreateSaleDto {

    @IsString()
    name : string ;

    @IsInt()
    capacity : number;

    @IsBoolean()
    hasDataShow : boolean;
    
    @IsBoolean()
    @IsOptional()
    hasNetworkEquipment : boolean;

    @IsString()
    @IsOptional()
    @IsIn(['CPI' , 'CS'])
    area : string;

    @IsString()
    @IsOptional()
    @IsIn(['TD' , 'TP' , 'AMPHI'])
    roomType : string;
    

}
