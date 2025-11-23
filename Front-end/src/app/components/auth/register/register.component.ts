import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    rut: '',
    name: '',
    surname: '',
    email: '',
    password: '',
  };

  mensajeError: string | null = null;

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit() {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.onSubmit.bind(this));
    }
  }

  onSubmit() {
  }
}
