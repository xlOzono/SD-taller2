import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usr: number;

  @Column({ type: 'date' })
  fecha_registro: Date;

  @Column()
  huella_digital: string;  

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  // Relación con reservas
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];
}