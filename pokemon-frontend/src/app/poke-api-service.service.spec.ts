import { TestBed } from '@angular/core/testing';

import { PokeApiServiceService } from './poke-api-service.service';

describe('PokeApiServiceService', () => {
  let service: PokeApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
