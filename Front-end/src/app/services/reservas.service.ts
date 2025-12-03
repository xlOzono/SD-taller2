import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener reservas de un usuario desde el backend
  getReservasUser(userID: number): Observable<Reserva[]> {
    const headers = this.buildHeaders();
    return this.http
      .get<any>(`${this.apiUrl}/usuario/${userID}`, { headers })
      .pipe(
        map((resList) => (
          Array.isArray(resList) ? resList.map(this.normalizeReserva) : []
        )),
        catchError((err) => {
          console.error('Error al obtener reservas del usuario:', err);
          return of([] as Reserva[]);
        })
      );
  }

  // Crear reserva via API
  crearReserva(casilleroId: number, usuarioId: number): Observable<Reserva | null> {
    const body: any = {
      id_usr: usuarioId,
      // id_cld es opcional según DTO
      id_cld: casilleroId,
    };

    const headers = this.buildHeaders();

    return this.http.post<any>(`${this.apiUrl}`, body, { headers }).pipe(
      tap((res) => console.log('[FRONT] Respuesta de crear reserva:', res)),
      map((res) => {
        if (!res) {
          console.warn('[FRONT] Respuesta vacía del backend');
          return null;
        }
        console.log('[FRONT] PIN recibido:', res.pin);
        return this.normalizeReserva(res);
      }),
      catchError((err) => {
        console.error('Error al crear reserva:', err);
        return of(null);
      })
    );
  }


  // Cancelar (liberar) una reserva via API
  liberarReserva(id_rsv: number): Observable<Reserva | null> {
    const headers = this.buildHeaders();
    return this.http
      .patch<any>(`${this.apiUrl}/${id_rsv}/cancelar`, {}, { headers })
      .pipe(
        tap((res) => console.log('[FRONT] Respuesta al liberar reserva:', res)),
        map((res) => {
          if (!res) {
            console.warn('[FRONT] Respuesta vacía al liberar reserva');
            return null;
          }
          console.log('[FRONT] Reserva liberada exitosamente');
          return this.normalizeReserva(res);
        }),
        catchError((err) => {
          console.error('Error al cancelar reserva:', err);
          return of(null);
        })
      );
  }

  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Normaliza la respuesta del backend a la interfaz Reserva usada en el frontend
  private normalizeReserva = (raw: any): Reserva => {
    console.log('[FRONT] Normalizando reserva raw:', raw);
    
    const reserva: Reserva = {
      id_rsv: raw.id_rsv ?? raw.id ?? 0,
      estado: raw.estado ?? 'activa',
      fecha_vencimiento: raw.fecha_vencimiento ? new Date(raw.fecha_vencimiento) : new Date(),
      fecha_inicio: raw.fecha_inicio ? new Date(raw.fecha_inicio) : new Date(),
      pin: raw.pin ?? 0, 
      id_usr: raw.usuario?.id_usr ?? raw.id_usr ?? 0,
      id_cld: raw.celda?.id_cld ?? raw.id_cld ?? 0,
    };
    
    console.log('[FRONT] Reserva normalizada:', reserva);
    return reserva;
  };
}
