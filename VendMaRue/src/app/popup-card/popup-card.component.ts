import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Card } from '../../classes/Card';
import { User } from 'src/classes/User';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { EvaluationService } from '../evaluation.service';
import { Evaluation } from 'src/classes/Evaluation';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadService } from '../file-upload.service';
import { Router } from "@angular/router";
import { ChatService } from "../chat.service";
import { Chat } from "../../classes/Chat";

@Component({
  selector: 'app-popup-card',
  templateUrl: './popup-card.component.html',
  styleUrls: ['./popup-card.component.css']
})
export class PopupCardComponent implements OnInit, OnChanges {
  @Input() card!: Card;
  @Input() user!: User;
  currentRate: number = 0;
  currentEvalId: number = 0;
  list: number = 0;
  evallist: Evaluation[] = [];
  moyenne: number | null = null;
  afficher: boolean = false; // afficher le numéro de téléphone
  done: boolean = false;
  userString: string | null = sessionStorage.getItem('user');
  userSess: User;
  conversationList: Chat[] = []
  conversationID: number = 0
  connect: boolean = false

  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private evaluationService: EvaluationService,
    private uploadService: FileUploadService,
    private router: Router,
    private conversationService: ChatService
  ) {
    this.currentRate = 0;
    if (this.userString) { // Si on est connecté
      this.userSess = JSON.parse(this.userString);
    } else {
      this.userSess = new User(0, "", "", "", "", 0, new Date(), "", "");
    }
  }


  async ngOnInit(): Promise<void> {
    this.getMoyenne().then(newMoyenne => {
      this.moyenne = newMoyenne;
      this.currentRate = Number(newMoyenne);
    }).catch(error => {
      console.log("Erreur lors du calcul de la moyenne :", error);
    });
    this.card.photo = this.card.photo.startsWith("https") ? this.card.photo : await this.uploadService.getImageUrl(this.card.photo);
    this.done = true;
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card'] && !changes['card'].firstChange) {
      this.getMoyenne().then(newMoyenne => {
        this.moyenne = newMoyenne;
      }).catch(error => {
        console.log("Erreur lors du recalcul de la moyenne :", error);
      });
    }
  }
  closeModal(): void {
    this.activeModal.close();
  }

  Afficher(): void {
    this.afficher = !this.afficher;
  }

  // Ouverture de la conversation déclenché par "contacter"
  // On récupère id_user du post
  async newConversation(id: number) {
    /*Si l'utilisateur est connecté et n'est pas propriétaire de l'offre*/
    if (this.user.id !== 0 && this.user.id != id) {
      /*Récupération des conversations de la bdd*/
      try {
        const data = await this.conversationService.getData().toPromise();
        this.conversationList = data ? data : [];

        /*On cherche les conversations que l'utilisateur connecté possède*/
        const search = this.conversationList.find(u => u.userid_client === this.user.id && u.userid_vendor === this.card.userid);

        /*Si l'utilisteur possède une conversation, on récupère l'id*/
        if (search) {
          this.conversationID = search.id;
        } else {

          /*Sinon on créé la conversation*/
          const newChat = new Chat(0, this.card.title, this.card.userid, this.user.id, new Date());
          const createdChat = await this.conversationService.addChat(newChat).toPromise();


          /*Mise à jour de la bdd*/
          const updatedData = await this.conversationService.getData().toPromise();
          this.conversationList = updatedData ? updatedData : []

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
    this.closeModal()
  }



  ajouterPanier(): void {
    if (this.card.quantity > 0) {
      this.card.quantity -= 1;
    }
  }

  retirerPanier(): void {
    this.card.quantity += 1;
  }

  getUserService(): UserService {
    return this.userService;
  }

  createOrUpdateEvaluation(): void {
    const user_id = this.userService.getUserId();
    const card_id = this.card.id;
    const rate = this.currentRate;

    this.evaluationService.getData().subscribe(
      data => {
        this.evallist = data;

        this.evallist = this.evallist.filter(evaluation => evaluation.user_id === this.userService.getUserId() && evaluation.card_id === this.card.id);

        if (this.evallist.length > 0) {
          this.currentEvalId = this.evallist[0].id;
          this.evaluationService.updateEval(this.currentEvalId, rate).subscribe(() => {
            this.getMoyenne().then(newMoyenne => {
              this.moyenne = newMoyenne;
            }).catch(error => {
              console.log("Erreur lors du recalcul de la moyenne :", error);
            });
          });
        } else {
          //currentEvalId : autoincrement
          this.evaluationService.addEval({ id: this.currentEvalId, user_id: Number(user_id), card_id: card_id, rate: rate }).subscribe(
            () => {
              this.getMoyenne().then(newMoyenne => {
                this.moyenne = newMoyenne;
              }).catch(error => {
                console.log("Erreur lors du recalcul de la moyenne :", error);
              });
              console.log("Evaluation ajoutée");
            },
            (error: HttpErrorResponse) => console.log(error)
          );
        }
      },
      error => {
        console.log("Erreur lors de la récupération des évaluations :", error);
      }
    );
  }

  getMoyenne(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.evaluationService.getData().subscribe(
        data => {
          const fulllist: Evaluation[] = data.filter(evaluation => evaluation.card_id === this.card.id);

          let sum = 0;
          for (let i = 0; i < fulllist.length; i++) {
            sum += fulllist[i].rate;
          }

          const moyenne = sum / fulllist.length;
          resolve(moyenne);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  get moyenneAffichage(): string {
    if (this.moyenne !== null) {
      // console.log("Moyenne : " + this.moyenne.toString());
      return this.moyenne.toString();
    } else {
      return "Aucun avis";
    }
  }
}
