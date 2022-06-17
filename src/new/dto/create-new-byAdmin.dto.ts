import { IsNumberString, IsString } from "class-validator";

export class CreateNewDtoByAdmin
{

 @IsString( )
 object : string;

 @IsString()
 message : string;

}
