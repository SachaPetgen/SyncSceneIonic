import { Component } from '@angular/core';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {
  peopleOutline,
  people,
  newspaperOutline,
  newspaper, musicalNotes, musicalNotesOutline, logIn, logInOutline
} from "ionicons/icons";
import {AuthService} from "./shared/services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, AsyncPipe],
})
export class AppComponent {

  isLoggedIn$ = this.authService.isAuthenticated();

  constructor(protected readonly authService : AuthService, protected  router: Router) {
    addIcons({ newspaperOutline, newspaper, musicalNotes,  musicalNotesOutline, peopleOutline, people, logIn, logInOutline});
  }
}
