import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const POKE_API_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class PokemonStorageService {

  constructor(private http: HttpClient) { }

  getTest(){
    return this.http.get(POKE_API_URL + '/hello');
  }
}
