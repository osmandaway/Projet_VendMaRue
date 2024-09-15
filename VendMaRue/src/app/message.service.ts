import { Injectable } from '@angular/core';
import {Message} from "../classes/Message";
import {HttpClient} from "@angular/common/http";
import {User} from "../classes/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public http: HttpClient) { }

  getMessage(){
    return this.http.get<Message[]>('http://localhost:3000/Messages')
  }

  addMessage(msg:Message): Observable<any> {
    return this.http.post('http://localhost:3000/' + 'Messages',msg)
  }
}
