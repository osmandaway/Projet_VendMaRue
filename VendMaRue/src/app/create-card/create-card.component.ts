import { Component, OnInit } from '@angular/core';
import { Card } from 'src/classes/Card';
import { CardService } from '../card.service';
import { Router } from '@angular/router';
import { UserService } from "../user.service";
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})
export class CreateCardComponent implements OnInit {
  public product: Card;
  // Autres propriétés et méthodes nécessaires
  cardId: string | null = null;
  public cardToEdit: boolean = false;
  public file : File = new File([""], "");



  constructor(private route: ActivatedRoute, private cardService: CardService, private router: Router, private userService: UserService, private uploadService: FileUploadService) {
    this.product = new Card(0, '', 0, '', '', 0, 0, 0, 0, new Date(), '');
  }

  ngOnInit() {
    this.userService.checkUserSession() ? '' : this.router.navigateByUrl('');
    this.cardId = this.route.snapshot.paramMap.get('id');
    if (this.cardId) {
      this.cardService.getCardById(this.cardId).subscribe(card => {
        this.product = card; // Pré-remplir le formulaire avec les valeurs de l'annonce à modifier
      });
    }
  }

  onSubmit() {
    console.log('Le formulaire a été soumis.');
    // Validation du formulaire et traitement des données
    if (this.isFormValid()) {

      if (this.cardId) {
        this.cardService.updateCard(this.cardId, this.product).subscribe(
          (data: Card) => {
            // console.log('Annonce mise à jour :', data);
            this.router.navigateByUrl('/mes-annonces'); // Rediriger vers la page appropriée après la mise à jour
          },
          (error: any) => {
            console.error("Erreur lors de la mise à jour de l'annonce :", error);
          }
        );
      } else {
        this.addProduct();
      }
      this.resetForm(); // Réinitialiser le formulaire

    } else {
      // Gestion des erreurs ou des conditions invalides
    }
  }

  resetForm() {
    const form = document.getElementById('productForm') as HTMLFormElement;
    form.reset();
  }
  
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.product.photo = this.file.name; 
      // Ajouter le préfixe "../assets/" au nom du fichier //penser à changer le nom du fichier 
    }
  }

  addProduct() {
    this.product.userid = this.userService.getUserId()
    this.product.date = new Date();
    // console.log(this.product.photo)
    this.uploadService.uploadImage(this.file)
    this.cardService.addCard(this.product).subscribe(
      (data: Card) => {
        // console.log('Nouveau produit ajouté :', data);
        const queryParams = {
          info: ``
        }
        this.router.navigate(['redirect'],{queryParams})      },
      error => {
        console.error("Erreur lors de l'ajout du produit :", error);
      }
    );
  }

  isFormValid(): boolean {
    const { title, brand, price, quantity, date, loc,OnSale} = this.product;

    // Vérification des champs requis
    if (!title || !brand || !price || !quantity || !date || !loc|| !OnSale) {
      return false;
    }

    return true;
  }
}


