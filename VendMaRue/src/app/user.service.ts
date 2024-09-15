import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../classes/User';
import { async, delay, Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [];
  list_length!: number;
  lastid: number = 0;
  url: string = 'http://localhost:3000/Users';

  constructor(private http: HttpClient) {
    this.getDataLength();
    this.getData();
  }

  /**
   * Récupère les données des utilisateurs à partir de l'URL spécifiée.
   */
  getData() {
    this.http.get<User[]>(this.url).subscribe((users) => {
      this.users = users;
    });
  }

  /**
   * Récupère les données des utilisateurs à partir de l'URL spécifiée.
   * @returns Un Observable contenant un tableau d'objets User.
   */
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  /**
   * Récupère le nombre d'utilisateurs enregistrés.
   */
  getDataLength() {
    this.list_length = this.users.length;
  }

  /**
   * Ajoute un nouvel utilisateur en envoyant une requête POST avec les données de l'utilisateur à l'URL spécifiée.
   * @param user - User représentant les données de l'utilisateur à ajouter.
   * @returns Observable contenant l'objet User ajouté.
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  /**
   * Crée une session utilisateur en vérifiant les informations d'identification fournies.
   * @param email - L'adresse e-mail de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   */
  createUserSession(email: string, password: string) {
    const user = this.users.find(
      (u) => u.user_email === email && bcrypt.compareSync(password, u.user_pwd) //compare le mdp en clair avec le mdp crypté
    );
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * Récupère l'utilisateur actuellement connecté à partir de la session en cours.
   * @returns L'objet JSON de l'utilisateur ou null s'il n'y a pas d'utilisateur connecté.
   */
  getSessionUser(): string | null {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      return userString;
    }
    return null;
  }

  /**
   * Vérifie si la session de l'utilisateur est valide en comparant les données
   * stockées dans la session avec les données des utilisateurs enregistrés.
   * @returns true si la session de l'utilisateur est valide, false sinon.
   */
  checkUserSession(): boolean {
    const user = sessionStorage.getItem('user');
    if (user) {
      const userUsed: User = JSON.parse(user);
      const exist = this.users.some(
        (u) =>
          u.user_email === userUsed.user_email &&
          u.user_pwd === userUsed.user_pwd
      );
      if (exist) {
        // console.log("données de session valides");
        return true;
      } else {
        // console.log("données de session invalides");
        this.deleteUserSession();
        return false;
      }
    }
    // console.log("pas de données de session");
    return false;
  }

  /**
   * Récupère l'identifiant de l'utilisateur à partir de la session.
   * @returns L'identifiant de l'utilisateur si présent dans la session, sinon undefined.
   */
  getUserId() {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id;
      return id;
    }
  }

  /**
   * Récupère le nom de l'utilisateur à partir de la session.
   * @returns Le nom de l'utilisateur si présent dans la session, sinon undefined.
   */
  getUserSurname() {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const surname = user.user_surname;
      return surname;
    }
  }

  /**
   * Vérifie si l'adresse e-mail spécifiée est déjà utilisée par un utilisateur enregistré.
   * @param email - L'adresse e-mail à vérifier.
   * @returns True si l'adresse e-mail est déjà utilisée, False sinon.
   */
  checkUsedEmail(email: string): boolean {
    return this.users.some((u) => u.user_email === email) ? true : false;
  }

  /**
   * Supprime les données de session de l'utilisateur s'ils existent.
   */
  deleteUserSession() {
    if (sessionStorage.getItem('user')) {
      sessionStorage.removeItem('user');
    }
  }

  /**
   * Met à jour le mot de passe de l'utilisateur avec l'ID spécifié.
   * @param id L'ID de l'utilisateur dont le mot de passe doit être mis à jour.
   * @param user_pwd Le nouveau mot de passe à attribuer à l'utilisateur.
   * @returns Un observable contenant l'utilisateur mis à jour.
   */
  updatePwd(id: number, user_pwd: string): Observable<User> {
    // console.log(
    //   'on est dans updatePwd et on a id : ' + id + ' password : ' + user_pwd
    // );
    return this.http.patch<User>(this.url + `/${id}`, { user_pwd });
  }

  /**
   * Met à jour les informations de l'utilisateur avec l'ID spécifié.
   * @param id L'ID de l'utilisateur à mettre à jour.
   * @param user_pp L'URL de la photo de profil de l'utilisateur.
   * @param user_surname Le nom de famille de l'utilisateur.
   * @param user_name Le prénom de l'utilisateur.
   * @param user_phone Le numéro de téléphone de l'utilisateur.
   * @param user_loc La localisation de l'utilisateur.
   * @param user_desc La description de l'utilisateur.
   * @returns Un observable contenant l'utilisateur mis à jour.
   */
  updateUser(
    id: number,
    user_pp: string,
    user_surname: string,
    user_name: string,
    user_phone: number,
    user_loc: string,
    user_desc: string
  ): Observable<User> {
    //update SessionUser
    console.log('testUpdate');
    return this.http.patch<User>(this.url + `/${id}`, {
      user_pp,
      user_surname,
      user_name,
      user_phone,
      user_loc,
      user_desc,
    });
  }
  
  /**
   * Supprime l'utilisateur avec l'ID spécifié.
   * @param id L'ID de l'utilisateur à supprimer.
   * @returns Un observable vide.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}`);
  }
}
