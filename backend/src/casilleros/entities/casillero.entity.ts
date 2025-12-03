import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Celda } from './celda.entity';

@Entity()
export class Casillero {
  @PrimaryGeneratedColumn()
  id_cso: number;

  @Column()
  modelo: string;

  @Column()
  ubicacion: string;

  // Relación con Celda
  @OneToMany(() => Celda, (celda) => celda.casillero)
  celdas: Celda[];
}
