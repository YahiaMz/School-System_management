import { InjectRepository } from "@nestjs/typeorm";
import { IsDateString, IsInt, IsNumberString, IsString, Validate, ValidateIf, ValidatePromise } from "class-validator";
import { Level } from "src/level/entities/level.entity";
import { Repository } from "typeorm";

export class CreateBatchDto {
    
    @IsInt()
    level_id : number;

    @IsInt()
    year : number;
 
    @IsString()
    name : string;

}
