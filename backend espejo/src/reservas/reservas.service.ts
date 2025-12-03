import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Celda } from 'src/casilleros/entities/celda.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Celda)
    private celdaRepository: Repository<Celda>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

async createReserva(reservaData: Partial<Reserva>): Promise<Reserva> {
    
    
    const CASILLERO_ID_FIJO = 1;
    const celdaDisponible = await this.celdaRepository.findOne({
        where: { 
            casillero: { id_cso: CASILLERO_ID_FIJO },
            estado: 'disponible', 
        } as any, 
    });

    if (!celdaDisponible) {
        throw new Error('No hay celdas disponibles en el casillero ID 1.');
    }

    const reservaDataWithCelda = {
        ...reservaData,
        celda: celdaDisponible,
        estado: 'activa', 
    };

    const reserva = this.reservaRepository.create(reservaDataWithCelda);
    return this.reservaRepository.save(reserva);
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
    await this.reservaRepository.update(id_rsv, { estado: 'cancelada' });
  }
}
