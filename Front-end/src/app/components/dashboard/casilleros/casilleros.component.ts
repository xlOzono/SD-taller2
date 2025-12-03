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
  errorMessage: string | null = null;

  constructor(
    private casillerosService: CasillerosService,
    private modalService: NgbModal,
    private authService: AuthService,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario actual
    this.usuarioId = this.authService.getCurrentUserId();
    
    this.casillerosService.getCasilleros().subscribe((data: any) => {
      if (data && data.error) {
        this.errorMessage = data.error;
        this.casilleros = [];
        console.error('[CASILLEROS] Error:', data.error);
      } else {
        this.errorMessage = null;
        this.casilleros = Array.isArray(data) ? data : [];
      }
    });
  }

  getCardClass(estado: string): string {
    switch (estado) {
      case 'disponible':
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
        if (nuevaReserva && nuevaReserva.pin !== undefined && nuevaReserva.pin !== null) {
          this.reservaPin = nuevaReserva.pin;
        } else {
          this.reservaPin = null;
          console.error('La reserva creada es nula o no contiene un PIN');
        }

 
        this.modalService.open(this.successModal, { centered: true });
      });
  }

  // Cerrar modal de éxito y recargar la página para reflejar el nuevo estado
  confirmarPin(modalRef: any) {
    try {
      modalRef.close();
    } finally {
      // Recargar la página para que se actualicen los casilleros y reservas
      window.location.reload();
    }
  }

  @ViewChild('successModal') successModal!: TemplateRef<any>;
}
