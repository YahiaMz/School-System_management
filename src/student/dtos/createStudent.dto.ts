import {IsDateString, IsEmail , IsInt, IsOptional, IsPositive, IsString} from 'class-validator';

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
    batch_Id : number;   

    @IsOptional()
    @IsInt()
    @IsPositive()
    speciality_Id : number;   
    
    @IsInt()
    @IsPositive()
    section_Id : number;   
    
    @IsInt()
    @IsPositive()
    group_Id : number;   



}