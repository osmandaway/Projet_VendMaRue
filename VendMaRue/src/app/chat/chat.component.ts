import {Component, OnInit} from '@angular/core';
import {ChatService} from "../chat.service";
import {Chat} from "../../classes/Chat";
import {User} from "../../classes/User"
import {Message} from "../../classes/Message";
import {MessageService} from "../message.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  chatArray : Chat[]=[]
  vendor : User | any
  name : string = ""
  MessageArray: Message[] = [];
  public error: String = "";
  newMessage : Message = new Message(0,'',0,0,new Date())
  conversation_idx: number;

  /*Variables de session*/
  user : any
  userString: string | null = sessionStorage.getItem('user');
  connect : boolean = false

  constructor(private activatedroute : ActivatedRoute,private chatservice:ChatService, private messageservice : MessageService) {

    /*Test si l'on est connecté, récupère l'utilisateur connecté*/
    if (this.userString) { // Si on est connecté
      this.user = JSON.parse(this.userString);
/*
      console.log(this.user);
*/
      this.connect = true
    } else {
      this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
      this.connect = false
/*
      console.log(this.connect)
*/
    }

    /*Récupère le numéro de conversation*/
    this.conversation_idx = parseInt(this.activatedroute.snapshot.params['id'].replace(':', ''), 10);

    /*Récupère la liste des conversations*/
    this.chatservice.getData().subscribe(
      data => {
        this.chatArray = data
      }
    )
    this.refreshMessage()
  }
  ngOnInit(): void {}

  /*fonction récupère les messages de la bdd*/
  refreshMessage(){
    this.messageservice.getMessage().subscribe(data => {
      let tmpMsgArray = data.filter(u => u.conversation_id === this.conversation_idx)
      this.MessageArray = tmpMsgArray
/*
      console.log(this.MessageArray)
*/
    })
  }

  /*Ajout message bdd lorsqu'on clique sur envoyer*/
  onSubmit() {
    // console.log("Message : "+this.newMessage.contenu)
    this.messageservice.addMessage(new Message(0,this.newMessage.contenu,this.user.id,this.conversation_idx,new Date())).subscribe(
      data => {
/*
        console.log(data)
*/
        this.refreshMessage()
      }
    )
    this.newMessage.contenu = ""
  }

  getName(id:number) : string{
    this.chatservice.getUserList().subscribe(
      data => {
        const array = data
        if(array.find((u) => u.id === id)){
          this.vendor = array.find((u) => u.id === id);
          this.name = this.vendor.user_name;
        }
      },
      error => {
        console.error("error");
      }
    );
    return this.name
  }
}
