import { Component, OnInit,Input} from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../../classes/User"
@Component({
  selector: 'app-new-sidenav',
  templateUrl: './new-sidenav.component.html',
  styleUrls: ['./new-sidenav.component.scss']
})
export class NewSidenavComponent implements OnInit{
    @Input() sideNavStatus : boolean=false;
    list :any []=[]
    userString: string | null = sessionStorage.getItem('user');
    user : User;
    connect : boolean = false;
    constructor(public userservice : UserService) {
      if (this.userString) { // Si on est connecté
        this.user = JSON.parse(this.userString);
        this.connect = true
      } else {
        this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
        this.connect = false;
      }
    }

  getUserService() {return this.userservice;}


  ngOnInit() {
      this.list= [
        {
          name:'Home',
          icon:'fa-solid fa-house',
          route:'/home'
        },
        {
          name:'Conversation',
          icon:'fa-solid fa-comment',
          route:'/chats'
        },
        {
          name: 'Profil',
          icon: 'fa-solid fa-user',
          route:'/profil/:'
        }
      ];

    }

}