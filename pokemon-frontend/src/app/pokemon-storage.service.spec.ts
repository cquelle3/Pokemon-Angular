import { TestBed } from '@angular/core/testing';

import { PokemonStorageService } from './pokemon-storage.service';

describe('PokemonStorageService', () => {
  let service: PokemonStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
