import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ReservasService } from 'src/app/services/reservas.service';
import { Reserva } from 'src/app/models/reserva';
import { CasillerosService } from 'src/app/services/casilleros.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  loadingLiberar: { [id: number]: boolean } = {};
  reservaSeleccionada: Reserva | null = null;

  @ViewChild('confirmLiberar') confirmLiberar!: TemplateRef<any>;

  constructor(
    private reservasService: ReservasService,
    private casillerosService: CasillerosService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Usar el ID del usuario actual si está disponible; si no, caer a 101 como fallback
    const userId = this.authService.getCurrentUserId() ?? 101;
    this.reservasService.getReservasUser(userId).subscribe((data: Reserva[]) => {
      this.reservas = data;
    });
  }

  liberarReserva(reserva: Reserva) {
    if (!reserva) return;
    this.loadingLiberar[reserva.id_rsv] = true;

    this.reservasService.liberarReserva(reserva.id_rsv).subscribe((updated) => {
      this.loadingLiberar[reserva.id_rsv] = false;
      if (!updated) {
        console.error('Reserva no encontrada');
        return;
      }

      // Actualizar estado local
      const idx = this.reservas.findIndex((r) => r.id_rsv === reserva.id_rsv);
      if (idx !== -1) this.reservas[idx].estado = 'cancelada';

      // Poner el casillero a 'libre'
      this.casillerosService
        .actualizarEstado(reserva.id_cld, 'libre')
        .subscribe(() => {
          // opcional: notificar al usuario o refrescar UI
        });
    });
  }

  // Abre el modal de confirmación para liberar una reserva
  openConfirmLiberar(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.modalService.open(this.confirmLiberar, { centered: true });
  }

  // Confirmar la liberación desde el modal
  confirmarLiberar(modalRef: any) {
    modalRef.close();
    if (this.reservaSeleccionada) {
      this.liberarReserva(this.reservaSeleccionada);
      this.reservaSeleccionada = null;
    }
  }

  // Cancelar la acción desde el modal
  cancelarLiberar(modalRef: any) {
    modalRef.dismiss();
    this.reservaSeleccionada = null;
  }
}
