import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  IonBackButton, IonButton,
  IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonNote, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {AlertController, ToastController} from "@ionic/angular";
import {AuthService} from "../../shared/services/auth.service";
import {UserDetailsDTO} from "../../models/User/DTO/User/UserDetailsDTO";
import {Router} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {Gender, Role} from 'src/app/models/User/User';
import {UserUpdateDTO} from "../../models/User/DTO/User/UserUpdateDTO";
import {addIcons} from "ionicons";
import {
  briefcaseOutline, calendarOutline,
  callOutline, checkmarkOutline,
  keyOutline, lockClosedOutline, logOutOutline,
  mailOutline,
  personOutline, saveOutline, shieldCheckmarkOutline
} from "ionicons/icons";

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
    IonLabel,
    IonItem,
    IonInput,
    IonButton, ReactiveFormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonText],
  providers: [DatePipe]
})

export class AccountPage implements OnInit {

  public updateForm: FormGroup;
  public changePasswordForm: FormGroup;

  readonly Role = Role;
  readonly Gender = Gender;

  user: BehaviorSubject<UserDetailsDTO | null> = new BehaviorSubject<UserDetailsDTO | null>(null);
  user$ : Observable<UserDetailsDTO | null> = this.user.asObservable();

  formatedDateString : string = '';

  constructor(private readonly toastController : ToastController, private readonly alertController : AlertController,
              private readonly authService : AuthService, private readonly router : Router,
              private readonly userService : UserService, private datePipe: DatePipe,
              private readonly fb: FormBuilder) {

    addIcons({personOutline, mailOutline, callOutline, briefcaseOutline, calendarOutline, saveOutline, lockClosedOutline, keyOutline, checkmarkOutline, shieldCheckmarkOutline, logOutOutline });

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
      newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]],
      newPasswordConfirmation: ['', Validators.required]
    }
    ,{
      validators: this.passwordMatchValidator
    });
  }


  ngOnInit() {
    console.log("Init !");
  }

  async ionViewWillEnter(){
    await this.loadUserData();
  }

  async loadUserData() {
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
          handler: async () => {
            try {
              await this.authService.logout();
              await this.router.navigate(['/auth']);
            } catch (error) {
              console.error('Error during logout:', error);
            }
            return true;
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

    if(this.changePasswordForm.valid) {
      const changePasswordData = this.changePasswordForm.value;
      const changePasswordObservable: Observable<any> = this.userService.patchPassword(changePasswordData, this.authService.currentUser.value?.id!);

      changePasswordObservable.pipe(
        tap({
          next: (response) => {
            this.presentToast('Password changed successfully', 'success');
            this.changePasswordForm.reset();
          }
        }),
        catchError((error) => {
          this.presentToast('Wrong password !', 'danger');
          return throwError(() => error);
        })
      ).subscribe();
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const newPasswordConfirmation = control.get('newPasswordConfirmation');

    if (newPassword && newPasswordConfirmation && newPassword.value !== newPasswordConfirmation.value) {
      newPasswordConfirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (newPasswordConfirmation?.hasError('passwordMismatch')) {

      const errors = { ...newPasswordConfirmation.errors };
      delete errors['passwordMismatch'];
      newPasswordConfirmation.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  get isUpdateFormPristine(): boolean {
    return this.updateForm.pristine;
  }

  get isPasswordFormPristine(): boolean {
    return this.changePasswordForm.pristine;
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

  capitalizeFirstLetter(string : string) {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
  }

  getFieldError(fieldName : string, form : FormGroup) : string {
    const control = form.get(fieldName);

    if (!control?.errors || !control.dirty) return '';

    if (control.hasError('required')) return `${this.capitalizeFirstLetter(fieldName)} is required`;

    if (control.hasError('minlength')) return `${this.capitalizeFirstLetter(fieldName)} must be at least ${control.getError('minlength').requiredLength} characters`;

    if (control.hasError('pattern')) {
      if (fieldName === 'newPassword') {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
      if (fieldName === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
    }

    if (control.hasError('passwordMismatch')) return 'Passwords do not match';

    return 'Invalid input';
  }
}
