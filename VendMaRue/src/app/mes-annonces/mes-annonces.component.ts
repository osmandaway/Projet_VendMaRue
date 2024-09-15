import { Component, OnInit } from '@angular/core';
import { Card } from '../../classes/Card';
import { CardService } from '../card.service';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../classes/User';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'app-mes-annonces',
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.css']
})

export class MesAnnoncesComponent implements OnInit {
  user: User;
  cardlist: Card[] = [];
  userString: string | null = sessionStorage.getItem('user');
  pwd: string;
  userId: number = 0;
  showEditButton: boolean = false;
  showDeleteButton: boolean = false;



  constructor(private userService: UserService, private cardService: CardService,private router: Router,private modalService: NgbModal) {
    this.pwd = "";
    if (this.userString) { // Si on est connecté
      this.user = JSON.parse(this.userString);
    } else {
      this.user = new User(0, "", "", "", "", 0, new Date(), "", "");
    }
  }

  ngOnInit() {
    if (this.userString) {
      this.user = JSON.parse(this.userString);
      this.userId = this.user.id;
    }

    this.cardService.getData().subscribe(data => {
      this.cardlist = data.filter(card => card.userid === this.userId);
    });

    // Activer l'affichage du bouton "Modifier"
    this.showEditButton = true;
    this.showDeleteButton = true;
  }
  editCard(card: Card) {
    const cardId = card.id;
    this.router.navigate(['/create-card', cardId]);
  }

  deleteCard(card: Card) {
    const modalRef = this.modalService.open(ConfirmationDialogComponent);
    modalRef.componentInstance.message = 'Êtes-vous sûr de vouloir supprimer cette carte ?';

    modalRef.result.then(result => {
      if (result === 'confirm') {
        // L'utilisateur a confirmé la suppression
        this.cardService.deleteCard(card.id).subscribe(() => {
          console.log("Carte supprimée avec succès.");
          // Afficher un message de succès ou effectuer toute autre action nécessaire
          this.router.navigateByUrl('');
        });
      }
    }, () => {
      // La boîte de dialogue a été fermée sans confirmation
    });
  }



}