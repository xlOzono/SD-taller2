import { IsInt, IsOptional } from 'class-validator';

export class CreateReservaDto {
	@IsInt()
	id_usr: number;

	@IsOptional()
	@IsInt()
	id_cld?: number;
}
