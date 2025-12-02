import { Component, OnInit } from '@angular/core';
import { Casillero } from 'src/app/models/casillero';
import { CasillerosService } from 'src/app/services/casilleros.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-casilleros',
  templateUrl: './casilleros.component.html',
  styleUrls: ['./casilleros.component.css'],
})
export class CasillerosComponent implements OnInit {
  casilleroSeleccionado: any;
  casilleros: Casillero[] = [];

  constructor(
    private casillerosService: CasillerosService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.casillerosService.getCasilleros().subscribe((data) => {
      this.casilleros = data;
    });
  }

  getCardClass(estado: string): string {
    switch (estado) {
      case 'libre':
        return 'text-bg-success';
      case 'ocupado':
        return 'text-bg-secondary';
      case 'defectuoso':
        return 'text-bg-danger';
      default:
        return '';
    }
  }

  reservar(casillero: Casillero, content: any) {
    this.casilleroSeleccionado = casillero;
    this.modalService.open(content);
  }

  confirmarReserva(modalRef: any) {
    modalRef.close();
    throw new Error('Falta agregar servicio de reserva.');
  }
}
