import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasillerosService } from './casilleros.service';
import { CasillerosController } from './casilleros.controller';
import { Casillero } from './entities/casillero.entity';
import { Celda } from './entities/celda.entity';
import { SeedService } from './seed.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Casillero, Celda])  
  ],
  controllers: [CasillerosController],
  providers: [CasillerosService, SeedService],
  exports: [CasillerosService, SeedService],
})
export class CasillerosModule {}
