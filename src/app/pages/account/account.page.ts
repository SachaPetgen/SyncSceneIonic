import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {AlertController, ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {UserDetailsDTO} from "../../models/User/DTO/UserDetailsDTO";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonInput, IonButton]
})
export class AccountPage implements OnInit {

  user: UserDetailsDTO = {} as UserDetailsDTO;

  constructor(private readonly toastController : ToastController, private readonly alertController : AlertController,
              private readonly authService : AuthService, private readonly router : Router) { }

  ngOnInit() {
    this.loadUserData();
  }


  async loadUserData() {
    try {
      // Replace with your actual user data fetching logic
      await this.authService.getCurrentUser();
    } catch (error) {
      this.presentToast('Error loading user data', 'danger');
    }
  }


  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes, Logout',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/auth']);
          }
        }
      ]
    });
    alert.present().then(() => console.log('Alert presented'));
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present().then(() => console.log('Toast presented'));
  }

}
