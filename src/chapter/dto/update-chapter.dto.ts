import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateChapterDto } from './create-chapter.dto';

export class UpdateChapterDto  {

    @IsString()
    @IsOptional()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

}
