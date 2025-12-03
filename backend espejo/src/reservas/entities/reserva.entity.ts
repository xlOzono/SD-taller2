import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Celda } from '../../casilleros/entities/celda.entity';
import { User } from 'src/users/entities/user.entity';

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
  @ManyToOne(() => User, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'id_usr' })
  usuario: User;

  // Relación con Celda
  @ManyToOne(() => Celda, (celda) => celda.reservas)
  @JoinColumn({ name: 'id_cld' })
  celda: Celda;
}
