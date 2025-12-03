import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';

import { Reserva } from './entities/reserva.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Celda } from 'src/casilleros/entities/celda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,   
      Celda,
      Usuario,
    ]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}