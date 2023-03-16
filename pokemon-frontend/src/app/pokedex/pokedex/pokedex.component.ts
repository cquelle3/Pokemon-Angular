import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokeApiServiceService, PokemonLink } from 'src/app/poke-api-service.service';
import { CaughtPokemon, PokemonStorageService } from 'src/app/pokemon-storage.service';

interface caughtPokemonObj {
  [key: string] : string
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit, OnDestroy{
  gen1Pokemon: PokemonLink[] = [];
  caughtPokemon: CaughtPokemon[] = [];
  caughtPokemonChunks: CaughtPokemon[][] = [];
  pokemonName: String = "";
  pokemonImage: String = "";
  pokemonPokedexDesc: String = "";
  animatedPokedexDesc: String = "";
  typeAnimationInterval: any;
  pokedexIndex: number = 0;
  caughtChunkIndex: number = 0;
  pokedexBGImage: string = 'PokedexBoxBG.png';

  subscriptionList: Subscription[] = [];

  constructor(
    private pokeApiService: PokeApiServiceService,
    private pokemonStorageService: PokemonStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //pull list of pokemon we have caught
    this.subscriptionList.push(this.pokemonStorageService.getCaughtPokemon().subscribe((data) => {
      if(data){
        console.log(data);
        const chunkSize = 20;
        for(let i=0; i < data.length; i += chunkSize){
          const chunk = data.slice(i, i + chunkSize);
          this.caughtPokemonChunks.push(chunk);
        }
        console.log(this.caughtPokemonChunks);
        this.caughtPokemon = data;

        //pull gen 1 pokemon list
        this.subscriptionList.push(this.pokeApiService.getGen1Pokemon().subscribe((data) => {
          if(data){
            this.gen1Pokemon = data.results;
          }
        }));
      }
    }));
  }

  //get pokemon info when clicking on pokemon PC sprites
  pcPokemonEmit(pokeInfo: CaughtPokemon){
    this.pokemonImage = "";
    this.pokemonPokedexDesc = "";
    this.loadPokemonInfo(pokeInfo.name, pokeInfo.isShiny);
  }

  navigateLeftPC(){
    this.caughtChunkIndex -= 1;
  }

  navigateRightPC(){
    this.caughtChunkIndex += 1;
  }

  //load pokemon information
  loadPokemonInfo(name: string, isShiny: boolean){
 
    //get pokemon sprite
    this.subscriptionList.push(this.pokeApiService.getPokemonInfo(name.trim().toLowerCase()).subscribe(
      (data) => {
        if(data){

          //set pokemon image link
          if(isShiny){
            this.pokemonImage = data.sprites.front_shiny;
            this.pokedexBGImage = 'PokedexBoxShinyBG.png';
          }
          else{
            this.pokemonImage = data.sprites.front_default;
            this.pokedexBGImage = 'PokedexBoxBG.png';
          }
          this.pokemonName = data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1);
          this.pokedexIndex = data.game_indices[19].game_index;

          //get pokemon pokedex description
          this.subscriptionList.push(this.pokeApiService.getSpeciesInfo(data.species.url).subscribe((speciesData) => {
            //get the original pokedex description
            var pokedex_entry = speciesData.flavor_text_entries.find((entry) => entry.language['name'] == 'en' && entry.version['name'] == 'red');
            this.pokemonPokedexDesc = pokedex_entry?.flavor_text!;
            this.pokemonPokedexDesc = this.pokemonPokedexDesc.replace('\f', ' ');

            //stop typing animation and reset pokedex description
            if(this.typeAnimationInterval != undefined){
              clearInterval(this.typeAnimationInterval);
              this.animatedPokedexDesc = "";
            }
            //start type animation for pokedex description
            this.typePokedexDescription(this.pokemonPokedexDesc);
          }));

        }
      }
    ));
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

  backButton(){
    this.router.navigate(['/main-menu']);
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptionList){
      sub.unsubscribe();
    }
    clearInterval(this.typeAnimationInterval);
  }
}
