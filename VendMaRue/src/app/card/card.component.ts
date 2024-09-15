import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Card } from '../../classes/Card';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupCardComponent } from '../popup-card/popup-card.component';
import { UserService } from '../user.service';
import { FileUploadService } from '../file-upload.service';
import { User } from "../../classes/User";
import { ChatService } from "../chat.service";
import { Chat } from "../../classes/Chat";
import { Router } from "@angular/router";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() card!: Card;
  @Input() showEditButton: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Output() editCardEvent = new EventEmitter<Card>();
  @Output() deleteCardEvent = new EventEmitter<Card>();

  users: User[] = [];
  done: boolean = false;
  conversationList: Chat[] = []
  conversationID: number = 0
  userString: string | null = sessionStorage.getItem('user');
  user: any
  connect: boolean = false
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private uploadService: FileUploadService, private service: ChatService, private router: Router
  ) {
    if (this.userString) { // Si on est connecté
      this.user = JSON.parse(this.userString);
      this.connect = true
    } else {
      this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
      this.connect = false
    }
  }

  async ngOnInit(): Promise<void> {
    this.users = this.userService.users;
    this.card.photo = await this.uploadService.getImageUrl(this.card.photo);
    this.done = true;
    try {
      const data = await this.service.getData().toPromise();
      this.conversationList = data ? data : [];
    } catch (error) {
      console.log(error);
    }
  }

  getUserById(id: number): User { // à remplacer plus tard, car pas très beau
    let tmp: User | undefined = this.users.find((user) => user.id === id);
    return tmp ? tmp : new User(0, "", "DeletedUser", "DeletedUser", "DeletedUser", 0, new Date(), "", "");;
  }

  openModal() {
    const modalRef = this.modalService.open(PopupCardComponent);
    modalRef.componentInstance.card = this.card;
    modalRef.componentInstance.user = this.getUserById(this.card.userid);
    // console.log(this.card.id);
  }

  editCard() {
    this.editCardEvent.emit(this.card);
  }

  getUploadService() {
    return this.uploadService;
  }

  deleteCard(card: Card) {
    // Appeler la méthode deleteCardEvent avec la carte en tant que paramètre
    this.deleteCardEvent.emit(this.card);
  }
  // Ouverture de la conversation déclenché par "contacter"
  // On récupère id_user du post
  async newConversation(id: number) {
    /*Si l'utilisateur est connecté et n'est pas propriétaire de l'offre*/
    if (this.user.id !== 0 && this.user.id != id) {
          /*Récupération des conversations de la bdd*/
          try {
            const data = await this.service.getData().toPromise();
            this.conversationList = data?data:[];

            /*On cherche les conversations que l'utilisateur connecté possède*/
            const search = this.conversationList.find(u => u.userid_client === this.user.id && u.userid_vendor === this.card.userid);

        /*Si l'utilisteur possède une conversation, on récupère l'id*/
        if (search) {
          this.conversationID = search.id;
        } else {

          /*Sinon on créé la conversation*/
          const newChat = new Chat(0, this.card.title, this.card.userid, this.user.id, new Date());
          const createdChat = await this.service.addChat(newChat).toPromise();


          /*Mise à jour de la bdd*/
          const updatedData = await this.service.getData().toPromise();
          this.conversationList = updatedData?updatedData:[]

          /*Récupération id de la nouvelle conversation*/
          const updatedSearch = this.conversationList.find(u => u.userid_client === this.user.id && u.userid_vendor === this.card.userid);
          this.conversationID = updatedSearch ? updatedSearch.id : 0;
        }
      } catch (error) {
        console.log(error);
      }

      /*Redirection sur la page de conversation*/
      const queryParams = {
        info: `/chat/:${this.conversationID}`,
      };
      this.router.navigate(['/redirect'], { queryParams });

    } else {
      /*L'utilisateur n'est pas connecté*/
      console.log("User not connected");
    }

  }


}
