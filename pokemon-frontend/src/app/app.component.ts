import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokeApiServiceService, Pokemon, PokemonLink } from './poke-api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  gen1Pokemon: PokemonLink[] = [];
  pokemonName: String = "";
  pokemonImage: String = "";
  pokemonPokedexDesc: String = "";
  animatedPokedexDesc: String = "";
  typeAnimationInterval: any;

  subscriptionList: Subscription[] = [];

  constructor(private pokeApiService: PokeApiServiceService)
  {}

  ngOnInit(): void {

    //pull gen 1 pokemon list
    this.subscriptionList.push(this.pokeApiService.getGen1Pokemon().subscribe((data) => {
      if(data){
        this.gen1Pokemon = data.results;
        this.loadPokemonInfo(this.gen1Pokemon[0].name);
      }
    }));

  }

  //reset image, pokedex description, clear animation interval, and pull info for selected pokemon
  onEnter(){
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.animatedPokedexDesc = "";
    if(this.typeAnimationInterval != undefined){
      clearInterval(this.typeAnimationInterval);
    }
    this.loadPokemonInfo(this.pokemonName);
  }

  loadPokemonInfo(name: String){
    //get pokemon sprite
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(name.trim().toLowerCase()).subscribe(
      (data) => {
        if(data){
          //set pokemon image link
          this.pokemonImage = data.sprites.front_default;

          //get pokemon pokedex description
          this.subscriptionList.push(this.pokeApiService.getSpeciesInfo(data.species.url).subscribe((speciesData) => {
            //get the original pokedex description
            var pokedex_entry = speciesData.flavor_text_entries.find((entry) => entry.language['name'] == 'en' && entry.version['name'] == 'red');
            this.pokemonPokedexDesc = pokedex_entry?.flavor_text!;
            this.pokemonPokedexDesc = this.pokemonPokedexDesc.replace('\f', ' ');

            //start type animation for pokedex description
            this.typeAnimation();
          }));

        }
      },
      (err: Error) => {}
    ));
  }

  typeAnimation(){
    var charIndex = 0;
    this.typeAnimationInterval = setInterval(() => {
      this.animatedPokedexDesc += this.pokemonPokedexDesc[charIndex];
      charIndex += 1;
      if(charIndex >= this.pokemonPokedexDesc.length){
        clearInterval(this.typeAnimationInterval);
      }
    }, 50);
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
    clearInterval(this.typeAnimationInterval);
  }

}
