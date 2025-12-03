import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Celda } from '../../casilleros/entities/celda.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id_rsv: number;

  @Column()
  estado: string;

  @Column()
  fecha_vencimiento: Date;

  @Column()
  fecha_inicio: Date;

  @Column()
  pin: number;

  // Relación con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'id_usr' })
  usuario: Usuario;

  // Relación con Celda
  @ManyToOne(() => Celda, (celda) => celda.reservas)
  @JoinColumn({ name: 'id_cld' })
  celda: Celda;
}
