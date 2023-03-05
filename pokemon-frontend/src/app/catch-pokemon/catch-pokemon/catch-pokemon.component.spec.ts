import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchPokemonComponent } from './catch-pokemon.component';

describe('CatchPokemonComponent', () => {
  let component: CatchPokemonComponent;
  let fixture: ComponentFixture<CatchPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatchPokemonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatchPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
