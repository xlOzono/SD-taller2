import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private reservas: Reserva[] = [
    {
      id_rsv: 1,
      id_cld: 1,
      id_usr: 101,
      fecha_inicio: new Date('2025-12-01'),
      fecha_vencimiento: new Date('2025-12-25'),
      estado: 'activa',
      pin: 1234,
    },
    {
      id_rsv: 2,
      id_cld: 2,
      id_usr: 101,
      fecha_inicio: new Date('2024-01-12'),
      fecha_vencimiento: new Date('2024-01-20'),
      estado: 'finalizada',
      pin: 3659,
    },
    {
      id_rsv: 3,
      id_cld: 1,
      id_usr: 101,
      fecha_inicio: new Date('2025-01-12'),
      fecha_vencimiento: new Date('2025-01-20'),
      estado: 'finalizada',
      pin: 3659,
    },
    {
      id_rsv: 2,
      id_cld: 4,
      id_usr: 102,
      fecha_inicio: new Date('2024-02-01'),
      fecha_vencimiento: new Date('2024-02-15'),
      estado: 'activa',
      pin: 5678,
    },
  ];

  constructor() {}

  // Obtener todos los casilleros
  getReservasUser(userID: number): Observable<Reserva[]> {
    return of(this.reservas.filter((reserva) => reserva.id_usr === userID));
  }

  // Crear una nueva reserva: calcula fechas, genera PIN único y agrega a la lista
  crearReserva(casilleroId: number, usuarioId: number): Observable<Reserva> {
    // fecha de inicio = ahora
    const fechaInicio = new Date();
    // fecha de vencimiento = inicio + 14 días
    const fechaVencimiento = new Date(fechaInicio.getTime() + 14 * 24 * 60 * 60 * 1000);

    // generar id_rsv
    const maxId = this.reservas.reduce((max, r) => (r.id_rsv > max ? r.id_rsv : max), 0);
    const newId = maxId + 1;

    // generar PIN único entre todas las reservas (4 dígitos)
    let pin: number;
    const existingPins = new Set(this.reservas.map((r) => r.pin));
    do {
      pin = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    } while (existingPins.has(pin));

    const nuevaReserva: Reserva = {
      id_rsv: newId,
      id_cld: casilleroId,
      id_usr: usuarioId,
      fecha_inicio: fechaInicio,
      fecha_vencimiento: fechaVencimiento,
      estado: 'activa',
      pin: pin,
    };

    //Aca deberia crear la reserva en el backend
    this.reservas.push(nuevaReserva);
    return of(nuevaReserva);
  }

  // Cambia el estado de una reserva a 'cancelada' (liberar)
  liberarReserva(id_rsv: number): Observable<Reserva | null> {
    const reserva = this.reservas.find((r) => r.id_rsv === id_rsv);
    if (!reserva) {
      return of(null);
    }
    reserva.estado = 'cancelada';
    return of(reserva);
  }
}
