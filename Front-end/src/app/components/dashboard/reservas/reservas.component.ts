import { Component, OnInit } from '@angular/core';
import { ReservasService } from 'src/app/services/reservas.service';
import { Reserva } from 'src/app/models/reserva';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    // Usuario 101 es estático por ahora
    this.reservasService.getReservasUser(101).subscribe((data: Reserva[]) => {
      this.reservas = data;
    });
  }
}
