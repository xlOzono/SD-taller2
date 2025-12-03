import { Reserva } from "src/reservas/entities/reserva.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id_usr: number;

    @Column({ unique: true })
    rut: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 'estudiante' })
    role: string;

    @Column({ default: false })
    fingerprint: boolean;

    @OneToMany(() => Reserva, (reserva) => reserva.usuario)
      reservas: Reserva[];
}
