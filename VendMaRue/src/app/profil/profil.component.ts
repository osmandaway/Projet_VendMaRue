import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../classes/User";
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { CardService } from '../card.service';
import { Card } from 'src/classes/Card';
import { DatePipe } from '@angular/common';
import { FileUploadService } from '../file-upload.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  @Input() user !: User;
  userlist: User[] = [];
  cardlist: Card[] = [];
  user_idx: number;
  userString: string | null = sessionStorage.getItem('user');
  onMyPage: boolean = false;
  done: boolean = false;

  constructor(private activatedroute: ActivatedRoute, private userService: UserService, private cardService: CardService, private uploadService: FileUploadService) {
    this.user_idx = parseInt(this.activatedroute.snapshot.params['id'].replace(':', ''), 10);

    if (this.userString) { // Si on est connecté
      const connectedUser: User = JSON.parse(this.userString);
      if (connectedUser.id == this.user_idx) {
        this.onMyPage = true;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    // Chargement du profil de l'utilisateur
    this.userService.getUser().subscribe(async (data) => {
      this.userlist = data;
      for (let i = 0; i < this.userlist.length; i++) {
        if (this.userlist[i].id === this.user_idx) {
          this.user = this.userlist[i];
          break;
        }
      }
  
      this.user.user_pp = await this.uploadService.getImageUrl(this.user.id + "_pp.jpg");
      console.log(this.user.user_pp);
      this.done = true;
    });
  
    // Chargement des posts de l'utilisateur
    this.cardService.getData().subscribe((data) => {
      this.cardlist = data;
  
      this.cardlist = this.cardlist.filter((card) => card.userid === this.user_idx);
  
      /*console.log(this.cardlist.length + " cards trouvées");*/
    });
  }
  
}
