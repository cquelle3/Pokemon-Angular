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

  subscriptionList: Subscription[] = [];

  constructor(private pokeApiService: PokeApiServiceService)
  {}

  ngOnInit(): void {

  }

  onEnter(){
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName.trim().toLowerCase()).subscribe(
      (data) => {
        this.pokemonImage = data.sprites.front_default;
        console.log(data);
        this.subscriptionList.push(this.pokeApiService.getSpeciesInfo(data.species.url).subscribe((speciesData) => {
          var pokedex_entry = speciesData.flavor_text_entries.find((entry) => entry.language['name'] == 'en' && entry.version['name'] == 'red');
          this.pokemonPokedexDesc = pokedex_entry?.flavor_text!;
          console.log(this.pokemonPokedexDesc);
        }));
      },
      (err: Error) => {}
    ));
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
  }

}
