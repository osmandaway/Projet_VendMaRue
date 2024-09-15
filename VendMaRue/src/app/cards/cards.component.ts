import { Component, OnInit, HostListener } from '@angular/core';
import { Card } from 'src/classes/Card';
import { CardService } from '../card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  CardArray: Card[] = [];
  displayedCards: Card[] = []; // Liste des cartes affichées
  pageSize = 8; // Nombre de cartes à afficher à chaque chargement
  index: number = 0; // Nombre de cartes restantes à charger

  constructor(private service: CardService) {
    this.service.getData().subscribe(data => {
      this.CardArray = data;
      this.loadMoreCards(); // Charger les premières cartes
    });
  }

  ngOnInit(): void { }

  // Écouteur d'événement de scroll de la fenêtre
  @HostListener('window:scroll', [])
  onScroll(): void {
    // Si l'utilisateur a atteint le bas du contenu 
    if (100 + (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      this.loadMoreCards(); // Charger plus de cartes lorsque l'utilisateur atteint le bas du scroll
    }
  }

  // Charger plus de cartes
  loadMoreCards(): void {
    const startIndex = this.displayedCards.length;
    const endIndex = startIndex + this.pageSize;
    if (startIndex < this.CardArray.length) {
      this.displayedCards = this.displayedCards.concat(this.CardArray.slice(startIndex, endIndex));
    }
    this.index = this.CardArray.length - this.displayedCards.length; // Calculer le nombre de cartes restantes à charger
  }
}
