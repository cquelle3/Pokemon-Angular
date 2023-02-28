import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokeApiServiceService } from './poke-api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  pokemonName: String = "";
  pokemonImage: String = "";
  pokemonPokedexDesc: String = "";
  animatedPokedexDesc: String = "";
  typeAnimationInterval: any;

  subscriptionList: Subscription[] = [];

  constructor(private pokeApiService: PokeApiServiceService)
  {}

  ngOnInit(): void {

  }

  onEnter(){
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.animatedPokedexDesc = "";
    if(this.typeAnimationInterval != undefined){
      clearInterval(this.typeAnimationInterval);
    }
    //get pokemon sprite
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName.trim().toLowerCase()).subscribe(
      (data) => {
        if(data){
          this.pokemonImage = data.sprites.front_default;

          //get pokemon pokedex description
          this.subscriptionList.push(this.pokeApiService.getSpeciesInfo(data.species.url).subscribe((speciesData) => {
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
