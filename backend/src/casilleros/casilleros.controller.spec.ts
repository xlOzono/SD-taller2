import { Test, TestingModule } from '@nestjs/testing';
import { CasillerosController } from './casilleros.controller';
import { CasillerosService } from './casilleros.service';

describe('CasillerosController', () => {
  let controller: CasillerosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasillerosController],
      providers: [CasillerosService],
    }).compile();

    controller = module.get<CasillerosController>(CasillerosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
