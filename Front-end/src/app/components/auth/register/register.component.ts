import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: RegisterRequest = {
    rut: '',
    name: '',
    surname: '',
    email: '',
    password: '',
  };

  mensajeError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const { rut, name, surname, email, password } = this.formData;

    if (!rut || !name || !surname || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.authService.register(this.formData).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar', err);
        const mensaje = err.error?.message || 'Error desconocido';
        alert('Error: ' + mensaje);
      }
    });
  }
}
