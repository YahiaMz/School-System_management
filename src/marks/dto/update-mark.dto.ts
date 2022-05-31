import { PartialType } from '@nestjs/mapped-types';
import { CreateMarkDto } from './create-mark.dto';

export class UpdateMarkDto extends PartialType(CreateMarkDto) {}
