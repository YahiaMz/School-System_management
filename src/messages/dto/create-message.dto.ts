import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {

    @IsInt() 
    sender_Id  : number;

    @IsInt()                   
    @IsIn([1 ,2 ,3])         /* { 1 : admin , 2 : teacher , 3: student} */
    senderType :  number;

    @IsInt()
    @IsOptional()
    group_Id : number;

    @IsInt()
    batch_Id : number;

    @IsString()
    message : string;

}
