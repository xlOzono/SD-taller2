import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Casillero } from 'src/app/models/casillero';
import { CasillerosService } from 'src/app/services/casilleros.service';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-casilleros',
  templateUrl: './casilleros.component.html',
  styleUrls: ['./casilleros.component.css'],
})
export class CasillerosComponent implements OnInit {
  casilleroSeleccionado: any;
  casilleros: Casillero[] = [];
  usuarioId: number | null = null;
  reservaPin: number | null = null;

  constructor(
    private casillerosService: CasillerosService,
    private modalService: NgbModal,
    private authService: AuthService,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario actual
    this.usuarioId = this.authService.getCurrentUserId();
    
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
    
    if (!this.usuarioId) {
      console.error('No se encontró el ID del usuario');
      return;
    }

    if (!this.casilleroSeleccionado) {
      console.error('No hay casillero seleccionado');
      return;
    }

    // Llamar al servicio para crear la reserva (fechas y PIN se calculan en el servicio)
    this.reservasService
      .crearReserva(this.casilleroSeleccionado.id_cld, this.usuarioId)
      .subscribe((nuevaReserva) => {
        // Guardar el PIN para mostrar en el modal de éxito
        this.reservaPin = nuevaReserva.pin;

        // Abrir modal de éxito
        this.modalService.open(this.successModal, { centered: true });
      });
  }

  @ViewChild('successModal') successModal!: TemplateRef<any>;
}
