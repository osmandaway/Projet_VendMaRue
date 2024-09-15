import { Component } from '@angular/core';
import {Chat} from "../../classes/Chat";
import {ChatService} from "../chat.service";
import {User} from "../../classes/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  ChatArray: Chat[] = [];
  chat : boolean = true
  userString: string | null = sessionStorage.getItem('user');
  user : User
  connect : boolean = false

  constructor(private service: ChatService, private router : Router) {

    if (this.userString) { // Si on est connecté
      this.user = JSON.parse(this.userString);
      this.connect = true
    } else {
      this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
      this.connect = false
    }

    this.service.getData().subscribe(data => {
      this.ChatArray = data.filter(u=>u.userid_client === this.user.id || u.userid_vendor === this.user.id)
      if(this.ChatArray.length == 0){
        this.chat=false
      }
/*
      console.log(this.ChatArray)
*/
    })
  };

  conversation(id : number){
    const queryParams = {
      info: `/chat/:${id}`,
    };
    this.router.navigate(['/redirect'], { queryParams });
  }
}
