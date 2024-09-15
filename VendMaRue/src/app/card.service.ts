import { Injectable } from '@angular/core';
import { Card } from '../classes/Card';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  Array : Card[] = []
  constructor(private http:HttpClient,private router: Router) { }
  private apiUrl = 'http://localhost:3000/Cards';



  getData() : Observable<Card[]> {
    return this.http.get<Card[]>('http://localhost:3000/Cards')
  }

  addCard(card: Card): Observable<Card> {
    return this.http.post<Card>('http://localhost:3000/Cards', card);
  }

  getCardById(cardId: string): Observable<Card> {
    const url = `${this.apiUrl}/${cardId}`;
    return this.http.get<Card>(url);
  }

  updateCard(cardId: string, card: Card): Observable<Card> {
    const url = `${this.apiUrl}/${cardId}`;
    return this.http.put<Card>(url, card);
  }
  deleteCard(cardId: number): Observable<Card> {
    const url = `${this.apiUrl}/${cardId}`;
    return this.http.delete<Card>(url);
  }

}
