import { IsInt, IsOptional } from 'class-validator';

export class CreateReservaDto {
	@IsInt()
	id_usr: number;

	// Opcional: cliente puede enviar id_cld pero el servicio actualmente asigna una celda disponible
	@IsOptional()
	@IsInt()
	id_cld?: number;
}
