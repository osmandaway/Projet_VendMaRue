
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../classes/Evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  evaluations: Evaluation[] = [];
  list_length!: number;
  lastid:number=0;
  constructor(private http:HttpClient) {
    this.getDataLength();
    this.getData().subscribe(evaluations => {
      this.evaluations = evaluations;
    });
  }
  
  getData(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>('http://localhost:3000/Evaluations');
  }
  getDataLength() {
    this.getData().subscribe(data => {
      this.list_length = data.length;
    });
  }      
    addEval(evaluation: Evaluation): Observable<Evaluation> {
      // this.http.post<Evaluation>('http://localhost:3000/Evaluations', evaluation).subscribe(response => {
      //   console.log("Ca ajoute -->", response);
      // });
            return this.http.post<Evaluation>('http://localhost:3000/Evaluations', evaluation);

    }
    deleteEval(id : number): Observable<void> {

      // this.http.delete<Evaluation>(`http://localhost:3000/Evaluations/${id}`).subscribe(response => {
      //   console.log("Ca supprime -->", response + " : " + id);
      // });
      const url = `http://localhost:3000/Evaluations/${id}`;
      return this.http.delete<void>(url);
    }
    updateEval(id : number, rate : number): Observable<Evaluation> {
      const url = `http://localhost:3000/Evaluations/${id}`;
      return this.http.patch<Evaluation>(url, {rate});
    }
    
  }



