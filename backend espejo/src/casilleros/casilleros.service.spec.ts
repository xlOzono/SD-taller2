import { Test, TestingModule } from '@nestjs/testing';
import { CasillerosService } from './casilleros.service';

describe('CasillerosService', () => {
  let service: CasillerosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasillerosService],
    }).compile();

    service = module.get<CasillerosService>(CasillerosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
