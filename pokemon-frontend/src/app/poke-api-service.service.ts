import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const POKE_API_URL = "https://pokeapi.co/api/v2/";

interface Pokemon{
  sprites: PokemonSprites;
}

interface PokemonSprites{
  front_default: String;
  versions: any;
}

@Injectable({
  providedIn: 'root'
})
export class PokeApiServiceService {

  constructor(private http: HttpClient) 
  { }

  getPokemonInfo(name: String): Observable<Pokemon>{
    let url = POKE_API_URL + 'pokemon/' + name;
    return this.http.get<Pokemon>(url);
  }
}
