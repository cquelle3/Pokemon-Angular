import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeApiServiceService, PokemonLink, PokemonList } from 'src/app/poke-api-service.service';
import { PokemonStorageService, CaughtPokemon } from 'src/app/pokemon-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catch-pokemon',
  templateUrl: './catch-pokemon.component.html',
  styleUrls: ['./catch-pokemon.component.scss']
})
export class CatchPokemonComponent implements OnInit, OnDestroy{

  gen1Pokemon: PokemonLink[] = [];
  pokemonImage: string = "";
  pokemonName: string = "";
  isPokemonShiny: boolean = false;

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
          
          this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.gen1Pokemon[0].name).subscribe((data) => {
            if(data){
              this.pokemonImage = data.sprites.front_default;
            }
          }))

          this.randomEncounter();
        }
      }));
  }

  randomEncounter(){

    this.randomEncounterInterval = setInterval(() => {
      this.pokemonImage = "";
      this.pokemonName = "";

      let pokemonIndex = Math.floor(Math.random() * ((this.gen1Pokemon.length - 1) - 0 + 1)) + 0;
      this.pokemonName = this.gen1Pokemon[pokemonIndex].name;

      this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName).subscribe((pokemonInfo) => {
        if(pokemonInfo){

          let shinyChance = Math.random();
          if(shinyChance > .5){
            this.pokemonImage = pokemonInfo.sprites.front_shiny;
            this.isPokemonShiny = true;
          }
          else{
            this.pokemonImage = pokemonInfo.sprites.front_default;
            this.isPokemonShiny = false;
          }
        }
      }));

    }, 10000);
  }

  catchPokemon(){
    console.log(this.pokemonName);
    console.log(this.isPokemonShiny);
    clearInterval(this.randomEncounterInterval);

    let pokemon: CaughtPokemon = {
      name: this.pokemonName,
      isShiny: this.isPokemonShiny
    }

    this.subscriptionList.push(this.pokemonStorageService.postCaughtPokemon(pokemon).subscribe((res) => {
      if(res){
        console.log(res);
      }
    }));
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
    clearInterval(this.randomEncounterInterval);
  }

}
