import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from "../chat.service";
import {Message} from "../../classes/Message";
import {User} from "../../classes/User"
import {MessageService} from "../message.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit{

  @Input() message !: Message
  MessageArray : Message[]=[]
  user : any
  userString: string | null = sessionStorage.getItem('user');
  conversation_idx: number;

  constructor(private activatedroute : ActivatedRoute,private messageService : MessageService,private chatservice : ChatService) {
    this.conversation_idx = parseInt(this.activatedroute.snapshot.params['id'].replace(':', ''), 10);

    if (this.userString) { // Si on est connecté
      this.user = JSON.parse(this.userString);
/*
      console.log("Dans message component : " + this.user);
*/
    } else {
      this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
    }

  }

  ngOnInit():void {
/*
    console.log(this.message)
*/
  }


}
