import { Component, ViewChild } from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms';
import {IonicModule, IonDatetime, ToastController, ModalController} from '@ionic/angular';
import { AuthService } from '../../shared/services/auth.service';
import { Gender } from "../../models/User/User";
import { UserLoginDTO } from "../../models/User/DTO/User/UserLoginDTO";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { UserRegisterDTO } from "../../models/User/DTO/User/UserRegisterDTO";
import { UserService } from "../../shared/services/user.service";
import { Router } from "@angular/router";
import { addIcons } from "ionicons";
import {call, checkmark, key, lockClosed, mail, person} from "ionicons/icons";

type FormType = 'login' | 'register';

interface AuthError {
  message: string;
  field?: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class AuthPage {

  @ViewChild('datetime') datetime!: IonDatetime;


  loginForm!: FormGroup;
  registerForm!: FormGroup;
  currentForm: FormType = 'login';
  Gender = Gender;

  isLoading = false;

  datePickerOpen = false;
  selectedDate : string = '';
  maxDate = new Date().toISOString();

  private readonly MIN_PASSWORD_LENGTH = 6;
  private readonly MIN_USERNAME_LENGTH = 3;
  private readonly PHONE_PATTERN = '^[0-9]{10}$';

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly modalController: ModalController

  ) {

    addIcons({person, lockClosed, mail, key, checkmark, call });

    this.initializeForms();
  }
  private initializeForms() {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]],
      passwordConfirmation: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.showValidationErrors(this.loginForm);
      return;
    }

    this.isLoading = true;
    const loginData: UserLoginDTO = this.loginForm.value;

    this.userService.login(loginData).pipe(
      catchError(this.handleAuthError.bind(this)),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleAuthSuccess(response, 'Logged in successfully')
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.showValidationErrors(this.registerForm);
      return;
    }

    const date = new Date(this.registerForm.get('birthDate')?.value);
    const utcDate = date.toISOString();

    if(!utcDate || date > new Date()) {
      this.presentToast('Invalid date', 'danger');
      return;
    }

    this.isLoading = true;
    const registrationData: UserRegisterDTO = {
      ...this.registerForm.value,
      gender: Gender[this.registerForm.value.gender as keyof typeof Gender],
      birthDate: utcDate
    };

    this.userService.register(registrationData).pipe(
      catchError(this.handleAuthError.bind(this)),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleAuthSuccess(response, 'Successfully registered!')
    });
  }

  private async handleAuthSuccess(response: { token: string }, message: string): Promise<void> {
    try {
      await this.authService.setToken(response.token);
      await this.router.navigate(['/account']);
      await this.presentToast(message, 'success');
    } catch (error) {
      console.error('Post-authentication error:', error);
      await this.presentToast('An error occurred after authentication', 'danger');
    }
  }

  private handleAuthError(error: any) {
    console.log('Auth error:', error);
    this.presentToast(error?.error?.detail, 'danger');
    return throwError(() => error);
  }

  private showValidationErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);

      if (control) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmation = control.get('passwordConfirmation');

    if (password && confirmation && password.value !== confirmation.value) {
      confirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmation?.hasError('passwordMismatch')) {

      const errors = { ...confirmation.errors };
      delete errors['passwordMismatch'];
      confirmation.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  dateChanged(value: any) {
    this.selectedDate = value;
    this.registerForm.patchValue({ birthDate: value });
    console.log('Selected date:', value);
  }

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  capitalizeFirstLetter(string : string) {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
  }

  getFieldError(fieldName: string): string {
    const form = this.currentForm === 'login' ? this.loginForm : this.registerForm;
    const control = form.get(fieldName);

    if (!control?.errors || !control.dirty) return '';

    if (control.hasError('required')) return `${this.capitalizeFirstLetter(fieldName)} is required`;
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('minlength')) return `The ${fieldName} must be at least ${control.getError('minlength').requiredLength} characters`;
    if (control.hasError('pattern')) {
      if (fieldName === 'password') {
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
