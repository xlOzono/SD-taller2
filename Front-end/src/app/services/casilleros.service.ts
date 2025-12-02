import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Casillero } from '../models/casillero';

@Injectable({
  providedIn: 'root',
})
export class CasillerosService {
  private casilleros: Casillero[] = [
    { id_cld: 1, columna: 1, fila: 1, estado: 'libre' },
    { id_cld: 2, columna: 2, fila: 1, estado: 'ocupado' },
    { id_cld: 3, columna: 3, fila: 1, estado: 'defectuoso' },
    { id_cld: 4, columna: 4, fila: 1, estado: 'libre' },
    { id_cld: 5, columna: 1, fila: 2, estado: 'ocupado' },
    { id_cld: 6, columna: 2, fila: 2, estado: 'defectuoso' },
    { id_cld: 7, columna: 3, fila: 2, estado: 'libre' },
    { id_cld: 8, columna: 4, fila: 2, estado: 'ocupado' },
    { id_cld: 9, columna: 1, fila: 3, estado: 'defectuoso' },
    { id_cld: 10, columna: 2, fila: 3, estado: 'libre' },
    { id_cld: 11, columna: 3, fila: 3, estado: 'ocupado' },
    { id_cld: 12, columna: 4, fila: 3, estado: 'defectuoso' },
  ];

  constructor() {}

  // Obtener todos los casilleros
  getCasilleros(): Observable<Casillero[]> {
    return of(this.casilleros);
  }

  // Actualizar el estado de un casillero
  actualizarEstado(
    id_cld: number,
    nuevoEstado: string
  ): Observable<Casillero | undefined> {
    const casillero = this.casilleros.find((c) => c.id_cld === id_cld);
    if (casillero) {
      casillero.estado = nuevoEstado;
    }
    return of(casillero);
  }
}
