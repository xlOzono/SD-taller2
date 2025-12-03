import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth';

export interface UserRegisterData {
  rut: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';  

  constructor(private http: HttpClient) {}

  // Método para el login
  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response: LoginResponse) => {
        // Guardar los datos del usuario después del login exitoso
        if (response) {
          this.saveUserData(response);
        }
      })
    );
  }

  // Guardar los datos del usuario en localStorage
  saveUserData(loginResponse: LoginResponse): void {
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('userId', loginResponse.id.toString());
    localStorage.setItem('userEmail', loginResponse.email);
  }

  // Obtener el ID del usuario actual
  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // Obtener el email del usuario actual
  getCurrentUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Obtener el token del usuario actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Limpiar datos del usuario (logout)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Método para el registro
  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }
}
