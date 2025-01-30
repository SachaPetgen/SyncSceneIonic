import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, IonDatetime, ToastController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import {Gender} from "../../models/User/User";
import {UserLoginDTO} from "../../models/User/DTO/User/UserLoginDTO";
import {catchError, Observable, tap, throwError} from "rxjs";
import {UserRegisterDTO} from "../../models/User/DTO/User/UserRegisterDTO";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class AuthPage {

  @ViewChild(IonDatetime) datetime!: IonDatetime;

  loginForm: FormGroup;
  registerForm: FormGroup;

  currentForm: 'login' | 'register' = 'login';
  Gender = Gender;
  datePickerOpen = false;

  constructor(private readonly authService: AuthService, private readonly userService : UserService,
              private fb: FormBuilder, private readonly router: Router, private toastController: ToastController) {

    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {

      const loginData: UserLoginDTO = this.loginForm.value;
      const loginObservable: Observable<any> = this.userService.login(loginData);

      loginObservable.pipe(
        tap({
          next: (response) => {
            this.authService.setToken(response.token).then(
              () => {
                this.router.navigate(['/account']).then(() => {
                  this.presentToast("Logged in successfully", "success");
                });
              }
            );
          }
        }),
        catchError((error) => {
          this.presentToast("Unvalid login informations !", "danger");
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      this.presentToast("Unvalid login informations !", "danger");
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {

      const registrationData: UserRegisterDTO = this.registerForm.value;
      registrationData.gender = Gender[registrationData.gender as keyof typeof Gender]
      const registrationObservable: Observable<any> = this.userService.register(registrationData);

      registrationObservable.pipe(
        tap({
          next: (response) => {
            this.authService.setToken(response.token).then(
              () => {
                this.router.navigate(['/account']).then(() => {
                  this.presentToast("Successfully register informations !", "success");
                });
              }
            );
          }
        }),
        catchError((error) => {
          this.presentToast("Unvalid register informations !", "danger");
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      this.presentToast("Unvalid register informations !", "danger");
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('passwordConfirmation')?.value
      ? null
      : { mismatch: true };
  }

  presentDatePicker() {
    this.datePickerOpen = true;
  }

  dismissDatePicker() {
    this.datePickerOpen = false;
  }

  async confirmDate() {
    await this.datetime.confirm();
    const value = this.datetime.value;

    if (value && typeof value === 'string') {
      const date = new Date(value);
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));

      this.registerForm.patchValue({
        birthDate: utcDate.toISOString()
      });
    }

    this.dismissDatePicker();
  }

  dateChanged(event: any) {
    console.log('Date changed:', event);
  }

  formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    // Use UTC methods to display the date
    return `${date.getUTCDate().toString().padStart(2, '0')}/${
      (date.getUTCMonth() + 1).toString().padStart(2, '0')}/${
      date.getUTCFullYear()}`;
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
