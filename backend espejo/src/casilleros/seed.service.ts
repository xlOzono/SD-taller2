import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casillero } from './entities/casillero.entity';
import { Celda } from './entities/celda.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Casillero)
    private casilleroRepository: Repository<Casillero>,
    @InjectRepository(Celda)
    private celdaRepository: Repository<Celda>,
  ) {}

  async seedCasilleros() {
    // Verificar si ya existen casilleros
    const count = await this.casilleroRepository.count();
    if (count > 0) {
      console.log('[SEED] Casilleros ya existen, saltando seed');
      return;
    }

    console.log('[SEED] Creando casilleros de prueba...');

    // Crear casillero
    const casillero = this.casilleroRepository.create({
      id_cso: 1,
      modelo: 'Standard 4x5',
      ubicacion: 'Informatica UTA',
    });

    await this.casilleroRepository.save(casillero);

    // Crear celdas (20 celdas: 4 columnas x 5 filas)
    const celdas: Celda[] = [];
    for (let fila = 1; fila <= 5; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        celdas.push(
          this.celdaRepository.create({
            columna,
            fila,
            estado: 'disponible',
            casillero,
          })
        );
      }
    }

    await this.celdaRepository.save(celdas);
    console.log(`[SEED] Se crearon ${celdas.length} celdas`);
  }
}
