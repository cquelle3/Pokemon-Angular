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

  subscriptionList: Subscription[] = [];

  constructor(private pokeApiService: PokeApiServiceService)
  {}

  ngOnInit(): void {

  }

  onEnter(){
    this.pokemonImage = "";
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName.trim().toLowerCase()).subscribe(
      (data) => {
        //this.pokemonImage = data.sprites.versions['generation-iii']['firered-leafgreen']['front_default'];
        this.pokemonImage = data.sprites.front_default;
        console.log(data);
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
