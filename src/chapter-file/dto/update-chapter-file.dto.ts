import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateChapterFileDto } from './create-chapter-file.dto';

export class UpdateChapterFileDto {
    @IsString()
    @IsOptional()
    fileName : string;
}
