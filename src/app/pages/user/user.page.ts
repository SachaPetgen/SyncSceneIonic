import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {RegisterComponent} from "./register/register.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RegisterComponent]
})
export class UserPage implements OnInit {

  showRegisterComponent: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleRegisterComponent() {
    this.showRegisterComponent = !this.showRegisterComponent;
  }

}
