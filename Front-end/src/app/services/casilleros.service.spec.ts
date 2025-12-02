import { TestBed } from '@angular/core/testing';

import { CasillerosService } from './casilleros.service';

describe('CasillerosService', () => {
  let service: CasillerosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasillerosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
