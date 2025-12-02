export interface Reserva {
  id_rsv: number;
  estado: string;
  fecha_vencimiento: Date;
  fecha_inicio: Date;
  pin: number;
  id_usr: number;
  id_cld: number;
}
