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
import {RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {homeOutline, musicalNotesOutline, peopleOutline, people} from "ionicons/icons";
import {AuthService} from "./shared/services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, AsyncPipe],
})
export class AppComponent {

  isLoggedIn$ = this.authService.isAuthenticated();

  constructor(protected readonly authService : AuthService) {
    addIcons({ homeOutline, musicalNotesOutline, peopleOutline, people});

  }
}
