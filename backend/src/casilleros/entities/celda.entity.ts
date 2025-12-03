import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Casillero } from './casillero.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';


@Entity()
export class Celda {
  @PrimaryGeneratedColumn()
  id_cld: number;

  @Column()
  columna: number;

  @Column()
  fila: number;

  @Column({ default: 'disponible' })
  estado: string;

  // Relación con Casillero
  @ManyToOne(() => Casillero, (casillero) => casillero.celdas)
  @JoinColumn({ name: 'id_cso' })
  casillero: Casillero;

  // Relación con Reserva
  @OneToMany(() => Reserva, (reserva) => reserva.celda)
  reservas: Reserva[];
}
