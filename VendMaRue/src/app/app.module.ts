import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsComponent } from './cards/cards.component';
import { CardComponent } from './card/card.component';
import { PopupCardComponent } from './popup-card/popup-card.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilComponent } from './profil/profil.component';
import { NewHeaderComponent } from './new-header/new-header.component';
import { NewSidenavComponent } from './new-sidenav/new-sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CreateCardComponent } from './create-card/create-card.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';
import { SettingsComponent } from './settings/settings.component';
import { ChatComponent } from './chat/chat.component';
import { SearchComponent } from './search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AnnoncesFiltreComponent } from './annonces-filtre/annonces-filtre.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from '../environments/environment';
import { RedirectComponent } from './redirect/redirect.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MessageComponent } from './message/message.component';
import { ChatsComponent } from './chats/chats.component';

@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    CardComponent,
    PopupCardComponent,
    InscriptionComponent,
    ConnexionComponent,
    FooterComponent,
    ProfilComponent,
    NewHeaderComponent,
    NewSidenavComponent,
    CreateCardComponent,
    MesAnnoncesComponent,
    SettingsComponent,
    ChatComponent,
    SearchComponent,
    ChatComponent,
    AnnoncesFiltreComponent,
    RedirectComponent,
    ConfirmationDialogComponent,
    MessageComponent,
    ChatsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
