import { IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateMarkDto {


    @IsInt()
    student_Id : number ;

    @IsInt()
    module_Id : number;

    @IsOptional()
    @IsNumber()
    @Max(20)
    @Min(0)
    emd1 : number;
    
    @IsOptional()
    @IsNumber()
    @Max(20)
    @Min(0)
    emd2 : number;
    
    @IsOptional()
    @IsNumber()
    @Max(20)
    @Min(0)
    cc : number;

}
