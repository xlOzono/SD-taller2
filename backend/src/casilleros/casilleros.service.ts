import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celda } from './entities/celda.entity';
import { Casillero } from './entities/casillero.entity';


@Injectable()
export class CasillerosService {
  constructor(
    @InjectRepository(Casillero)
    private casilleroRepository: Repository<Casillero>,
    @InjectRepository(Celda)
    private celdaRepository: Repository<Celda>,
  ) {}


  async getCeldasByCasillero(id_cso: number): Promise<Celda[]> {
  return this.celdaRepository.find({
    where: {
      casillero: { id_cso },
    },
    relations: ['casillero'], 
  });
}


  async ocuparCasillero(id: number): Promise<void> {
    await this.celdaRepository.update(id, { estado: 'ocupado' });
  }

  async liberarCasillero(id: number): Promise<void> {
    await this.celdaRepository.update(id, { estado: 'disponible' });
  }
}

