import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const { email, password } = this.formData;
    if (!email || !password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
        }

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (err.error && err.error.message) {
          this.errorMessage = Array.isArray(err.error.message) 
            ? err.error.message[0] 
            : err.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';
        }
      }
    });
  }
}
