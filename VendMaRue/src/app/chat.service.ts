import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Chat} from "../classes/Chat";
import {User} from "../classes/User";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  list : Chat[] = []
  listOfUser : User[] = []
  vendor : any
  name : string = ""

  constructor(private http:HttpClient, private service :UserService) { }

  getData() : Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:3000/Chats')
  }


  getUserList(): Observable<User[]> {
    return this.service.getUser().pipe(
      tap((data) => {
        this.listOfUser = data;
      }),
      map(() => this.listOfUser)
    );
  }

  addChat(chat : Chat) :Observable<any>{
    return this.http.post('http://localhost:3000/Chats',chat)
  }


}
