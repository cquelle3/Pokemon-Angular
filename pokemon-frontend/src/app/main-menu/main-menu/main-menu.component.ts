import { Component, OnDestroy, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonStorageService } from 'src/app/pokemon-storage.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private pokemonStorageService: PokemonStorageService
  ){}

  ngOnInit(): void {
      this.pokemonStorageService.getTest().subscribe((data) => {
        console.log(data);
      });
  }

  openPokedex(){
    this.router.navigateByUrl('/pokedex');
  }

  openCatchPokemon(){
    this.router.navigateByUrl('/catch-pokemon');
  }
}
