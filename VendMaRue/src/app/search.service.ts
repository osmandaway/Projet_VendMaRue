import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from 'src/classes/Card';
import { User } from 'src/classes/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }
  
  getUser(search : string): Observable <User[]> {
    return this.http.get<User[]>(`http://localhost:3000/Users`);
  }
  getCards(search : string): Observable <Card[]> {
    return this.http.get<Card[]>(`http://localhost:3000/Cards`);
  }
}
