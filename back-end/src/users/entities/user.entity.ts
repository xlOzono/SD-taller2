import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

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
}
