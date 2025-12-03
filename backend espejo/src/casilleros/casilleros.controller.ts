import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasillerosService } from './casilleros.service';


@Controller('casilleros')
export class CasillerosController {
  constructor(private readonly casillerosService: CasillerosService) {}

  @Get('celdas')
  async getCeldas() {
    return this.casillerosService.getCeldasByCasillero(1); // Consideramos que es el casillero predeterminado
  }
  @Patch(':id/ocupar')
  ocuparCasillero(@Param('id') id: number) {
    return this.casillerosService.ocuparCasillero(id);
  }

  @Patch(':id/liberar')
  liberarCasillero(@Param('id') id: number) {
    return this.casillerosService.liberarCasillero(id);
  }
}
