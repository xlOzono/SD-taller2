import { PartialType } from '@nestjs/mapped-types';
import { CreateCasilleroDto } from './create-casillero.dto';

export class UpdateCasilleroDto extends PartialType(CreateCasilleroDto) {}
