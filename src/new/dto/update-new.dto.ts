import { PartialType } from '@nestjs/mapped-types';
import { IsBooleanString } from 'class-validator';
import { CreateNewDto } from './create-new.dto';

export class UpdateNewDto extends PartialType(CreateNewDto) {

}
