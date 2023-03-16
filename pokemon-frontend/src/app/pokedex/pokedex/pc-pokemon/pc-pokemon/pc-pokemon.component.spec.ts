import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcPokemonComponent } from './pc-pokemon.component';

describe('PcPokemonComponent', () => {
  let component: PcPokemonComponent;
  let fixture: ComponentFixture<PcPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcPokemonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
