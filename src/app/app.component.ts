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
import {homeOutline, musicalNotesOutline, peopleOutline} from "ionicons/icons";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink],
})
export class AppComponent {
  constructor() {
    addIcons({ homeOutline, musicalNotesOutline, peopleOutline });

  }
}
