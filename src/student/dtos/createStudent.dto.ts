import {IsDateString, IsEmail , IsInt, IsPositive, IsString} from 'class-validator';

export class CreateStudentDto { 

    
    @IsString()
    name : string;
    
    @IsString()
    lastName : string;

    @IsEmail()
    email : string;

    @IsString( )
    password : string;

    @IsString( ) 
    wilaya : string;

    @IsDateString()
    dateOfBirth : string;

    @IsInt()
    @IsPositive()
    group_Id : number;   



}