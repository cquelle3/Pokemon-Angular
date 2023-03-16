import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokeApiServiceService } from 'src/app/poke-api-service.service';
import { CaughtPokemon } from 'src/app/pokemon-storage.service';

@Component({
  selector: 'app-pc-pokemon',
  templateUrl: './pc-pokemon.component.html',
  styleUrls: ['./pc-pokemon.component.scss'],
  animations: [
    trigger('pokemonHover', [
      state('mouseOff', style({
        width: '68px',
        height: '56px',
      })),
      state('mouseOn', style({
        width: '78px',
        height: '66px',
      })),
      transition('mouseOff <=> mouseOn', [
        animate('.2s'),
      ]),
    ]),
  ],
})
export class PcPokemonComponent implements OnInit, OnDestroy {

  @Input() pokemonName: string = "";
  @Input() pokemonShiny: boolean = false;
  pcImage: string = "";
  subscriptionList: Subscription[] = [];

  @Output() pokemonEmitter = new EventEmitter<CaughtPokemon>;
  mouseHover: boolean = false;

  constructor(private pokeApiService: PokeApiServiceService) {
    
  }

  ngOnInit(): void {
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(this.pokemonName).subscribe((pokemonInfo) => {
      if(pokemonInfo){
        this.pcImage = pokemonInfo.sprites.versions['generation-viii']['icons']['front_default'];
      }
    }));
  }

  emitPokemonInfo(){
    this.pokemonEmitter.emit({'name': this.pokemonName, 'isShiny': this.pokemonShiny});
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
  }

}
