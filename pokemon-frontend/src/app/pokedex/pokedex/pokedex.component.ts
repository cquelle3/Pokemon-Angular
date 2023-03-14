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
  caughtPokemonCheck: caughtPokemonObj = {};
  hasCaught: boolean = true;
  pokemonName: String = "";
  pokemonImage: String = "";
  pokemonPokedexDesc: String = "";
  animatedPokedexDesc: String = "";
  typeAnimationInterval: any;
  pokedexIndex: number = 0;

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
        this.caughtPokemon = data;
        //create an object to help check which pokemon are missing from pokedex
        for(var pokemon of this.caughtPokemon){
          if(this.caughtPokemonCheck[pokemon.name] == undefined){
            this.caughtPokemonCheck[pokemon.name] = '';
          }
        }

        //pull gen 1 pokemon list
        this.subscriptionList.push(this.pokeApiService.getGen1Pokemon().subscribe((data) => {
          if(data){
            this.gen1Pokemon = data.results;
            this.loadPokemonInfo(this.gen1Pokemon[this.pokedexIndex].name);
          }
        }));
      }
    }));
  }

  //load pokemon information
  loadPokemonInfo(name: string){
    //we have not caught this pokemon
    if(this.caughtPokemonCheck[name] == undefined){
      this.hasCaught = false;
      this.pokemonName = "";

      //stop typing animation and reset pokedex description
      if(this.typeAnimationInterval != undefined){
        clearInterval(this.typeAnimationInterval);
        this.animatedPokedexDesc = "";
      }
    }
    else{
      //we have caught this pokemon
      this.hasCaught = true;
 
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
