import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const POKE_API_URL = "https://pokeapi.co/api/v2/";

interface Pokemon{
  sprites: PokemonSprites;
  species: PokemonSpeciesLink;
}

interface PokemonSprites{
  front_default: string;
  versions: any;
}

interface PokemonSpeciesLink{
  name: string;
  url: string;
}

interface PokemonSpecies{
  flavor_text_entries: PokedexText[];
}

interface PokedexText{
  flavor_text: string;
  language: any;
  version: any;
}

@Injectable({
  providedIn: 'root'
})
export class PokeApiServiceService {

  constructor(private http: HttpClient) 
  { }

  getPokemonInfo(name: string): Observable<Pokemon>{
    let url = POKE_API_URL + 'pokemon/' + name;
    return this.http.get<Pokemon>(url);
  }

  getSpeciesInfo(url: string): Observable<PokemonSpecies>{
    return this.http.get<PokemonSpecies>(url);
  }
}
