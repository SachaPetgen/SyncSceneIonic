import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
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
import {UserService} from "../../services/user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Gender, Role} from 'src/app/models/User/User';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonInput,
    IonButton],
  providers: [DatePipe]
})

export class AccountPage implements OnInit {

  user: BehaviorSubject<UserDetailsDTO | null> = new BehaviorSubject<UserDetailsDTO | null>(null);
  user$ : Observable<UserDetailsDTO | null> = this.user.asObservable();

  formatedDateString : string = '';

  constructor(private readonly toastController : ToastController, private readonly alertController : AlertController,
              private readonly authService : AuthService, private readonly router : Router,
              private readonly userService : UserService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter(){

    console.log(this.authService.currentUser);
    this.loadUserData();
  }

  loadUserData() {
    if(this.authService.currentUser.value) {
      console.log(this.authService.currentUser.value);
      this.userService.getById(this.authService.currentUser.value.id).subscribe((user) =>{
        console.log(user);
        this.user.next(user);
        this.formatedDateString = this.datePipe.transform(user.birthDate, 'dd MMMM yyyy') || '';
      });
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

  protected readonly Gender = Gender;
  protected readonly Role = Role;
}
