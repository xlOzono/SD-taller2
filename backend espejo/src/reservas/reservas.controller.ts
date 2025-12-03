import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { Reserva } from './entities/reserva.entity';
import { ReservasService } from './reservas.service';


@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservaService: ReservasService) {}

  // Crear reserva
  @Post()
  createReserva(@Body() reservaData: Partial<Reserva>) {
    return this.reservaService.createReserva(reservaData);
  }

  // Obtener todas las reservas de un usuario
  @Get('usuario/:id')
  getReservasByUser(@Param('id') id: number) {
    return this.reservaService.getReservasByUser(id);
  }

  // Obtener las reservas de un casillero (solo hay uno con id = 1)
  @Get('casillero/:id')
  getReservaByCasillero(@Param('id') id: number) {
    return this.reservaService.getReservaByCasillero(1);
  }

  // Cancelar una reserva
  @Patch(':id/cancelar')
  cancelReserva(@Param('id') id: number) {
    return this.reservaService.cancelReserva(id);
  }
}
