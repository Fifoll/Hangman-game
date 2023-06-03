import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }


  getGameData() {
    return this.http.get('https://rickandmortyapi.com/api/character');
  }


  

}
