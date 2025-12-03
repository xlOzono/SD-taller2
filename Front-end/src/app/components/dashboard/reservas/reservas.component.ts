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
  currentUserId: number = 101; // Default fallback
  errorMessage: string | null = null;

  @ViewChild('confirmLiberar') confirmLiberar!: TemplateRef<any>;

  constructor(
    private reservasService: ReservasService,
    private casillerosService: CasillerosService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Usar el ID del usuario actual si está disponible; si no, caer a 101 como fallback
    this.currentUserId = this.authService.getCurrentUserId() ?? 101;
    this.reloadReservas();
  }

  // Método para recargar las reservas desde el backend
  reloadReservas(): void {
    console.log('[RESERVAS] Recargando reservas del usuario:', this.currentUserId);
    this.reservasService.getReservasUser(this.currentUserId).subscribe(
      (data: any) => {
        if (data && data.error) {
          this.errorMessage = data.error;
          this.reservas = [];
          console.error('[RESERVAS] Error:', data.error);
        } else {
          this.errorMessage = null;
          this.reservas = Array.isArray(data) ? data : [];
          console.log('[RESERVAS] Reservas actualizadas:', data);
        }
      },
      (error) => {
        this.errorMessage = 'Error al cargar las reservas';
        console.error('[RESERVAS] Error al recargar reservas:', error);
      }
    );
  }

  liberarReserva(reserva: Reserva) {
    if (!reserva) return;
    // Este método ya no se usa, la lógica está en confirmarLiberar()
    console.log('[RESERVAS] liberarReserva() deprecated - usar confirmarLiberar() en su lugar');
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
      console.log('[RESERVAS] Confirmando liberación de reserva:', this.reservaSeleccionada.id_rsv);
      
      // Enviar la solicitud de liberación al backend (sin esperar respuesta)
      this.reservasService.liberarReserva(this.reservaSeleccionada.id_rsv).subscribe(
        () => {
          console.log('[RESERVAS] Reserva liberada en el backend');
        },
        (error) => {
          console.error('[RESERVAS] Error al liberar:', error);
        }
      );
      

      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      this.reservaSeleccionada = null;
    }
  }

  // Cancelar la acción desde el modal
  cancelarLiberar(modalRef: any) {
    modalRef.dismiss();
    this.reservaSeleccionada = null;
  }
}