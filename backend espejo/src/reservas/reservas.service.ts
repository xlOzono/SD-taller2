import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Celda } from 'src/casilleros/entities/celda.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Celda)
    private celdaRepository: Repository<Celda>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReserva(reservaData: Partial<Reserva>): Promise<Reserva> {
    const { id_usr } = reservaData as any;

    if (!id_usr) {
      throw new BadRequestException('Se requiere id_usr en el cuerpo de la petición');
    }

    // Buscar usuario
    const usuario = await this.userRepository.findOneBy({ id_usr });
    if (!usuario) {
      throw new BadRequestException(`Usuario con id ${id_usr} no encontrado`);
    }

    let celda: Celda | null = null;
    const id_cld = (reservaData as any).id_cld;

    if (id_cld) {
      celda = await this.celdaRepository.findOneBy({ id_cld });
      if (!celda) {
        throw new BadRequestException(`Celda con id ${id_cld} no encontrada`);
      }
      if (celda.estado !== 'disponible') {
        throw new BadRequestException(`La celda ${id_cld} no está disponible`);
      }
    } else {
      // Si no se envía id_cld, buscar una celda disponible en el casillero fijo
      const CASILLERO_ID_FIJO = 1;
      celda = await this.celdaRepository.findOne({
        where: {
          casillero: { id_cso: CASILLERO_ID_FIJO },
          estado: 'disponible',
        } as any,
      });

      if (!celda) {
        throw new BadRequestException('No hay celdas disponibles en el casillero ID 1.');
      }
    }

    // Generar fechas
    const fechaInicio = new Date();
    const fechaVencimiento = new Date(fechaInicio.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Generar PIN único (4 dígitos)
    let pin: number;
    const maxAttempts = 50;
    let attempts = 0;
    do {
      pin = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      const existing = await this.reservaRepository.findOneBy({ pin });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('No se pudo generar un PIN único, inténtalo de nuevo');
    }

    // Construir entidad reserva
    const nuevaReserva = this.reservaRepository.create({
      estado: 'activa',
      fecha_inicio: fechaInicio,
      fecha_vencimiento: fechaVencimiento,
      pin,
      usuario,
      celda,
    } as any);

    // Marcar la celda como ocupada
    celda.estado = 'ocupado';
    await this.celdaRepository.save(celda);

    // Guardar la reserva
    const savedResult = await this.reservaRepository.save(nuevaReserva);
    const saved = (Array.isArray(savedResult) ? savedResult[0] : savedResult) as Reserva;

    // ✅ IMPORTANTE: Recuperar la reserva guardada CON todas sus relaciones
    const fullReserva = await this.reservaRepository.findOne({
      where: { id_rsv: saved.id_rsv },
      relations: ['usuario', 'celda', 'celda.casillero'],
    });

    if (!fullReserva) {
      throw new Error('No se pudo recuperar la reserva después de guardarla');
    }

    // Log para depuración
    console.log('[RESERVAS-ESPEJO] Reserva creada:', {
      id_rsv: fullReserva.id_rsv,
      pin: fullReserva.pin,
      estado: fullReserva.estado,
      usuario: fullReserva.usuario?.id_usr,
      celda: fullReserva.celda?.id_cld,
    });

    return fullReserva;
  }

  // Obtener todas las reservas de un usuario
  async getReservasByUser(id_usr: number): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: { usuario: { id_usr } },
      relations: ['usuario', 'celda'],
    });
  }

  // Obtener las reservas por casillero
  async getReservaByCasillero(id_cso: number): Promise<Reserva[]> {
  const celdas = await this.celdaRepository.find({
    where: { casillero: { id_cso } },  
    relations: ['casillero'],           
    });
    const reservas: Reserva[] = []; 
    
    for (let celda of celdas) {
      const reservasCelda = await this.reservaRepository.find({
        where: { celda: { id_cld: celda.id_cld } },
        relations: ['celda'],
      });
      reservas.push(...reservasCelda); 
    }

    return reservas;
  }

  // Cancelar una reserva
  async cancelReserva(id_rsv: number): Promise<void> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_rsv },
      relations: ['celda'],
    });

    if (!reserva) {
      throw new BadRequestException(`Reserva con id ${id_rsv} no encontrada`);
    }

    // Liberar la celda
    if (reserva.celda) {
      reserva.celda.estado = 'disponible';
      await this.celdaRepository.save(reserva.celda);
      console.log(`[RESERVAS-ESPEJO] Celda ${reserva.celda.id_cld} liberada`);
    }

    // Marcar la reserva como cancelada
    await this.reservaRepository.update(id_rsv, { estado: 'cancelada' });
    console.log(`[RESERVAS-ESPEJO] Reserva ${id_rsv} cancelada`);
  }
}
