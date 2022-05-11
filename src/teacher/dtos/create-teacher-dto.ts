
import {IsDateString, IsEmail , IsOptional, IsString, MinLength} from 'class-validator';

export class CreateTeacherDto {
    


    
    @IsString()
    name : string;
    
    @IsString()
    lastName : string;

    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    password : string;

    @IsString( ) 
    wilaya : string;

    @IsDateString()
    @IsOptional()
    dateOfBirth : string;


    

}