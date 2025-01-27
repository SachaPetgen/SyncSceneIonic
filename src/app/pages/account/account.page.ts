import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {UserDetailsDTO} from "../../models/User/DTO/User/UserDetailsDTO";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {Gender, Role} from 'src/app/models/User/User';
import {UserUpdateDTO} from "../../models/User/DTO/User/UserUpdateDTO";

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
    IonButton, ReactiveFormsModule],
  providers: [DatePipe]
})

export class AccountPage implements OnInit {

  updateForm: FormGroup;
  changePasswordForm: FormGroup;

  readonly Role = Role;
  readonly Gender = Gender;

  user: BehaviorSubject<UserDetailsDTO | null> = new BehaviorSubject<UserDetailsDTO | null>(null);
  user$ : Observable<UserDetailsDTO | null> = this.user.asObservable();

  formatedDateString : string = '';

  constructor(private readonly toastController : ToastController, private readonly alertController : AlertController,
              private readonly authService : AuthService, private readonly router : Router,
              private readonly userService : UserService, private datePipe: DatePipe,
              private readonly fb: FormBuilder) {

    this.updateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: [{value: '', disabled: true}],
      role: [{value: '', disabled: true}],
      birthDate: [{value: '', disabled: true}]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirmation: ['', Validators.required]
    }
    ,{
      validators: this.passwordMatchValidator
    });
  }


  ngOnInit() {
    this.loadUserData();

    // Populate form with user data


  }

  ionViewWillEnter(){
    this.loadUserData();
  }

  loadUserData() {
    if(this.authService.currentUser.value) {
      this.userService.getById(this.authService.currentUser.value.id).subscribe((user) =>{
        this.user.next(user);
        this.updateForm.patchValue({
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: Gender[user.gender],
          role: Role[user.role],
          birthDate: this.datePipe.transform(user.birthDate, 'dd MMMM yyyy') || '',
        });
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

    await alert.present();
  }

  onUpdate(){


    console.log('Update form:', this.updateForm.value);

    if(this.updateForm.valid){

      const updateData : UserUpdateDTO = this.updateForm.value;
      const updateDataObservable: Observable<any> = this.userService.update(updateData, this.authService.currentUser.value?.id!);

      updateDataObservable.pipe(
        tap({
          next: (response) => {
            console.log('User updated successfully', response.data);
            this.presentToast('Update done', 'success');
          }
        }),
        catchError((error) => {
            console.error('Update failed:', error);
            this.presentToast('Update failed', 'danger');
            return throwError(() => error);
        })
      ).subscribe();
    }
    else{
      console.log('Update form is not valid')
    }
  }

  onChangePassword() {
    console.log('Change password form:', this.changePasswordForm.value);

    if(this.changePasswordForm.valid) {
      const changePasswordData = this.changePasswordForm.value;
      const changePasswordObservable: Observable<any> = this.userService.patchPassword(changePasswordData, this.authService.currentUser.value?.id!);

      changePasswordObservable.pipe(
        tap({
          next: (response) => {
            console.log('Password changed successfully:', response);
            this.presentToast('Password changed successfully', 'success');
            this.changePasswordForm.reset();
          }
        }),
        catchError((error) => {
          console.error('Password change failed:', error);
          this.presentToast('Password change failed', 'danger');
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      console.log('Change password form is not valid');
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('newPasswordConfirmation')?.value
      ? null
      : { mismatch: true };
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
