import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokeApiServiceService, PokemonLink } from 'src/app/poke-api-service.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit, OnDestroy{
  gen1Pokemon: PokemonLink[] = [];
  pokemonName: String = "";
  pokemonImage: String = "";
  pokemonPokedexDesc: String = "";
  animatedPokedexDesc: String = "";
  typeAnimationInterval: any;
  pokedexIndex: number = 0;

  subscriptionList: Subscription[] = [];

  constructor(private pokeApiService: PokeApiServiceService)
  {}

  ngOnInit(): void {

    //pull gen 1 pokemon list
    this.subscriptionList.push(this.pokeApiService.getGen1Pokemon().subscribe((data) => {
      if(data){
        this.gen1Pokemon = data.results;
        this.loadPokemonInfo(this.gen1Pokemon[this.pokedexIndex].name);
      }
    }));

  }

  //reset image, pokedex description, clear animation interval, and pull info for selected pokemon
  // onEnter(){
  //   this.pokemonImage = "";
  //   this.pokemonPokedexDesc = "";
  //   this.animatedPokedexDesc = "";
  //   if(this.typeAnimationInterval != undefined){
  //     clearInterval(this.typeAnimationInterval);
  //   }
  //   this.loadPokemonInfo(this.pokemonName);
  // }

  loadPokemonInfo(name: String){
    //get pokemon sprite
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(name.trim().toLowerCase()).subscribe(
      (data) => {
        if(data){
          //set pokemon image link
          this.pokemonImage = data.sprites.front_default;
          this.pokemonName = data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1);

          //get pokemon pokedex description
          this.subscriptionList.push(this.pokeApiService.getSpeciesInfo(data.species.url).subscribe((speciesData) => {
            //get the original pokedex description
            var pokedex_entry = speciesData.flavor_text_entries.find((entry) => entry.language['name'] == 'en' && entry.version['name'] == 'red');
            this.pokemonPokedexDesc = pokedex_entry?.flavor_text!;
            this.pokemonPokedexDesc = this.pokemonPokedexDesc.replace('\f', ' ');

            //start type animation for pokedex description
            if(this.typeAnimationInterval != undefined){
              clearInterval(this.typeAnimationInterval);
              this.animatedPokedexDesc = "";
            }
            this.typePokedexDescription(this.pokemonPokedexDesc);
          }));

        }
      },
      (err: Error) => {}
    ));
  }

  navigatePokemonLeft(){
    this.pokedexIndex -= 1;
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.loadPokemonInfo(this.gen1Pokemon[this.pokedexIndex].name);
  }

  navigatePokemonRight(){
    this.pokedexIndex += 1;
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.loadPokemonInfo(this.gen1Pokemon[this.pokedexIndex].name);
  }

  typePokedexDescription(desc: String){
    var charIndex = 0;
    this.typeAnimationInterval = setInterval(() => {
      this.animatedPokedexDesc += desc[charIndex];
      charIndex += 1;
      if(charIndex >= desc.length){
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
