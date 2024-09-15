import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  mail: string = "";
  mdp: string = "";
  error: string = "";
  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getData();
  }

  onSubmit() {
    if (this.mail && this.mdp) { //si les deux champs sont remplis  
      this.mail = this.mail.toString();
      this.userService.createUserSession(this.mail, this.mdp);
      sessionStorage.getItem('user') ? this.router.navigate(['']) : this.error = "Mot de passe ou email incorrect";
    }

  }


}
