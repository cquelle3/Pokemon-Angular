import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeApiServiceService, PokemonLink, PokemonList } from 'src/app/poke-api-service.service';
import { PokemonStorageService, CaughtPokemon } from 'src/app/pokemon-storage.service';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-catch-pokemon',
  templateUrl: './catch-pokemon.component.html',
  styleUrls: ['./catch-pokemon.component.scss'],
  animations: [
    trigger('throwPokeball', [
      state('start', style({
        transform: 'translateY(-200px)'
      })),
      transition('* => start', [
        animate('1s')
      ]),
      transition('start => *', [
        animate('1s')
      ])
    ]),
  ]
})
export class CatchPokemonComponent implements OnInit, OnDestroy{

  gen1Pokemon: PokemonLink[] = [];
  pokemonImage: string = "";
  pokemonName: string = "";
  isPokemonShiny: boolean = false;
  shinyChance: number = .2;

  randomEncounterInterval: any;

  subscriptionList: Subscription[] = [];

  constructor(
    private pokeApiService: PokeApiServiceService,
    private pokemonStorageService: PokemonStorageService,
  ) {}

  ngOnInit(): void {
      this.subscriptionList.push(this.pokeApiService.getGen1Pokemon().subscribe((gen1Pokemon) => {
        if(gen1Pokemon){
          this.gen1Pokemon = gen1Pokemon.results;
          this.startRandomEncounter();
        }
      }));
  }

  startRandomEncounter(){
    this.randomEncounter();
    this.randomEncounterInterval = setInterval(() => {
      this.randomEncounter();
    }, 10000);
  }

  randomEncounter(){
    this.pokemonImage = "";
    this.pokemonName = "";

    let pokemonIndex = Math.floor(Math.random() * ((this.gen1Pokemon.length - 1) - 0 + 1)) + 0;
    this.pokemonName = this.gen1Pokemon[pokemonIndex].name;

    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName).subscribe((pokemonInfo) => {
      if(pokemonInfo){

        let shiny = Math.random();
        if(shiny < this.shinyChance){
          this.pokemonImage = pokemonInfo.sprites.front_shiny;
          this.isPokemonShiny = true;
        }
        else{
          this.pokemonImage = pokemonInfo.sprites.front_default;
          this.isPokemonShiny = false;
        }
      }
    }));
  }

  catchPokemon(){
    clearInterval(this.randomEncounterInterval);

    let pokemon: CaughtPokemon = {
      name: this.pokemonName,
      isShiny: this.isPokemonShiny
    }

    this.subscriptionList.push(this.pokemonStorageService.postCaughtPokemon(pokemon).subscribe((res) => {
      console.log(res);
      this.startRandomEncounter();
    }));
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
    clearInterval(this.randomEncounterInterval);
  }

}
