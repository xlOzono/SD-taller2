import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Casillero } from '../models/casillero';

@Injectable({
  providedIn: 'root',
})
export class CasillerosService {
  private apiUrl = 'http://localhost:3000/casilleros';

  constructor(private http: HttpClient) {}

  // Obtener todos los casilleros desde la API
  getCasilleros(): Observable<Casillero[] | { error: string }> {
    return this.http
      .get<Casillero[]>(`${this.apiUrl}/celdas`)
      .pipe(
        catchError((err) => {
          console.error('Error al obtener casilleros:', err);
          return of({ error: 'Error al cargar los casilleros' } as any);
        })
      );
  }

  // Actualizar el estado de un casillero vía API (ocupar/liberar)
  actualizarEstado(
    id_cld: number,
    nuevoEstado: string
  ): Observable<Casillero | undefined> {
    if (nuevoEstado === 'ocupado') {
      return this.http
        .patch<Casillero>(`${this.apiUrl}/${id_cld}/ocupar`, {})
        .pipe(
          catchError((err) => {
            console.error('Error al ocupar casillero:', err);
            return of(undefined);
          })
        );
    }

    if (nuevoEstado === 'libre') {
      return this.http
        .patch<Casillero>(`${this.apiUrl}/${id_cld}/liberar`, {})
        .pipe(
          catchError((err) => {
            console.error('Error al liberar casillero:', err);
            return of(undefined);
          })
        );
    }

    // Estado no manejado: no hacemos fallback en memoria; retornamos undefined
    console.warn('Estado no manejado en actualizarEstado:', nuevoEstado);
    return of(undefined);
  }
}
