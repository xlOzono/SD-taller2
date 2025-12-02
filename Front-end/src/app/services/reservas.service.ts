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
}
