import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SearchService } from '../search.service';
import { User } from 'src/classes/User';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Card } from 'src/classes/Card';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupCardComponent } from '../popup-card/popup-card.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchValue: string = "";
  users: User[] = [];
  usersforcard: User[] = [];
  cards: Card[] = [];
  cardsloc: Card[] = [];
  cardsbrands: Card[] = [];
  searchForm: FormGroup = this.fb.nonNullable.group({
    searchValue: '',
  });
  hasValue: boolean = false;
  constructor(private searchService: SearchService, private fb: FormBuilder, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  /**
   * Effectue une recherche en utilisant la valeur de recherche actuelle.
   * Récupère les utilisateurs et les cartes, lieux ou brands correspondant à la valeur de recherche.
   * Filtré les résultats pour n'inclure que ceux qui correspondent à la valeur de recherche.
   */
  fetchData(): void {
    // Vérifier si une valeur de recherche est présente
    if (this.searchValue.length > 0) {
      this.hasValue = true;
      const searchValueLower = this.searchValue.toLowerCase();

      // Appel des services pour récupérer les utilisateurs et les cartes
      const users$ = this.searchService.getUser(this.searchValue);
      const cards$ = this.searchService.getCards(this.searchValue);
      const cardsloc$ = this.searchService.getCards(this.searchValue);
      const cardsbrands$ = this.searchService.getCards(this.searchValue);
      // Utilisation de forkJoin pour attendre les résultats des deux appels de service
      forkJoin([users$, cards$, cardsloc$,cardsbrands$]).subscribe(results => {
        const users = results[0];
        const cards = results[1];
        const cardsloc = results[2];
        const cardsbrands = results[3];

        this.usersforcard = users;//copie des users pour les cartes
        // Filtrer les utilisateurs qui correspondent à la valeur de recherche
        this.users = users.filter(user =>
          (user.user_name.toLowerCase().includes(searchValueLower)) ||
          (user.user_surname.toLowerCase().includes(searchValueLower))
        );

        // Filtrer les cartes qui correspondent à la valeur de recherche
        this.cards = cards.filter(card =>
          (card.title.toLowerCase().includes(searchValueLower))
        );
        // Filter les cartes dont la localisation correspond à la valeur de recherche
        this.cardsloc = cardsloc.filter(card => (
          card.loc.toLowerCase().startsWith(searchValueLower)  
        ));
        // Filter les cartes dont la marque correspond à la valeur de recherche
        this.cardsbrands = cardsbrands.filter(card => (
          card.brand.toLowerCase().includes(searchValueLower)  
        ));
        // console.log(this.cardsbrands)
      });
    } else {
      // Aucune valeur de recherche, réinitialiser les résultats
      this.hasValue = false;
    }
  }

  /**
   * Navigue vers la page de profil d'un utilisateur spécifié par son identifiant.
   * Actualise la page après la navigation.
   *
   * @param userId L'identifiant de l'utilisateur dont on souhaite afficher le profil.
   */
  goToProfile(userId: number) {
    // this.router.navigateByUrl(`/profil/${userId}`, { skipLocationChange: false }).then(() => {
      // window.location.reload();
      const queryParams = {
        info: `profil/${userId}`
      }
      this.router.navigate(['redirect'],{queryParams})
    // });
  }

  /**
  * Ouvre une fenêtre modale pour afficher une carte spécifiée par son identifiant.
  * @param cardId L'identifiant de la carte que l'on souhaite afficher.
  */
  goToCard(cardId: number) {
    const modalRef = this.modalService.open(PopupCardComponent);
    modalRef.componentInstance.card = this.cards.find(card => card.id === cardId);
    modalRef.componentInstance.user = this.getUserById(cardId);
  }

  goToLoc(loc : string ): void {
    let tmplist = this.cardsloc.filter(card => card.loc === loc);
    const queryParams = {
      info: this.cardsloc[0].loc.toString(),
      cardlist: JSON.stringify(tmplist)
    };

  
    this.router.navigate(['/annonces-filtre'], { queryParams });
  }

  goToBrand(brand : string ): void {
    let tmplist = this.cardsbrands.filter(card => card.brand === brand);
    // console.log(tmplist);
    const queryParams = {
      info: this.cardsbrands[0].brand.toString(),
      cardlist: JSON.stringify(tmplist)
    };
    this.router.navigate(['/annonces-filtre'], { queryParams });

  } 

  onSubmit(): void {

  }


  /**
   * Gère l'événement de saisie dans le champ de recherche.
   * Met à jour la valeur de recherche, déclenche la récupération des données correspondantes et effectue les actions associées.
   */
  onSearchInput(): void {
    // Met à jour la valeur de recherche en la convertissant en minuscules
    this.searchValue = this.searchForm.value.searchValue.toLowerCase() ?? '';

    // Effectue la récupération des données correspondantes
    this.fetchData();

    // Affiche ou masque le résultat en fonction de la présence de données
    // console.log(this.hasValue);
  }

  getUserById(cardid: number): User { // à remplacer plus tard, car pas très beau
    let tmp: User | undefined = this.usersforcard.find((user) => user.id === cardid);
    return tmp ? tmp : new User(0, "", "DeletedUser", "DeletedUser", "DeletedUser", 0, new Date(), "", "");;
  }
}
