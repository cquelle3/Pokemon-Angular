import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeApiServiceService, PokemonLink, PokemonList } from 'src/app/poke-api-service.service';
import { PokemonStorageService, CaughtPokemon } from 'src/app/pokemon-storage.service';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-catch-pokemon',
  templateUrl: './catch-pokemon.component.html',
  styleUrls: ['./catch-pokemon.component.scss'],
  animations: [
    trigger('throwPokeball', [
      state('throw', style({
        transform: 'translateY(-350px)',
        width: '30px',
        height: '30px',
      })),
      state('open', style({
        "background-image": "url('../../../assets/PokeballOpen.png')",
        "height": '40px'
      })),
      state('close', style({
        "background-image": "url('../../../assets/Pokeball.png')",
        "height": '30px'
      })),
      transition('* => throw', [
        animate('1s')
      ]),
      transition('throw => open', [
        animate('0.3s')
      ]),
      transition('open => close', [
        animate('0.3s')
      ]),
      transition('close => *', [
        animate('5s')
      ]),
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
  currentAnimState: string = "";
  isCatching: boolean = false;

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

      this.currentAnimState = "throw";
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

  catchTrigger(){
    this.isCatching = true;
    clearInterval(this.randomEncounterInterval);
  }

  catchPokemon(){
    this.pokemonImage = "";

    let pokemon: CaughtPokemon = {
      name: this.pokemonName,
      isShiny: this.isPokemonShiny
    }

    this.subscriptionList.push(this.pokemonStorageService.postCaughtPokemon(pokemon).subscribe((res) => {
      console.log(res);
    }));
  }

  pokeballAnimationFinished(event: AnimationEvent){
    console.log(event);
    if(event.toState == 'throw'){
      this.currentAnimState = 'open';
    }
    else if(event.toState == 'open'){
      this.currentAnimState = 'close';
      this.catchPokemon();
    }
    else if(event.toState == 'close'){
      this.currentAnimState = '*';
    }
    else if(event.toState == '*'){
      this.isCatching = false;
      this.startRandomEncounter();
      this.currentAnimState = 'throw';
    }
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
    clearInterval(this.randomEncounterInterval);
  }

}
