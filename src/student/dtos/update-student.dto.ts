
import {  IsDateString, IsEmail, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateStudentDto { 
   
    @IsOptional()
    @IsString()
    name : string ;

    @IsOptional()
    @IsString( )
    lastName : string;


    @IsOptional()
    @IsEmail()
    email : string;
 
    @IsOptional()
    @IsString()
    password : string;


    @IsOptional()
    @IsDateString()
    dateOfBirth : string;

    @IsOptional()
    @IsString( ) 
    wilaya : string;

    

    @IsOptional()
    @IsInt()
    @IsPositive()
    speciality_Id : number;   


    @IsOptional()
    @IsInt()
    @IsPositive()
    section_Id : number;   

    @IsOptional()
    @IsInt()
    @IsPositive()
    group_Id : number;   






}