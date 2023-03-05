import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const POKE_API_URL = "http://localhost:3000";

export interface CaughtPokemon{
  name: string;
  isShiny: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonStorageService {

  constructor(private http: HttpClient) { }

  getTest(){
    return this.http.get(POKE_API_URL);
  }

  getCaughtPokemon(){
    return this.http.get(POKE_API_URL + '/caughtPokemon');
  }

  postCaughtPokemon(pokemon: CaughtPokemon){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(POKE_API_URL + '/caughtPokemon', JSON.stringify(pokemon), {
      headers: headers
    });
  }
}
