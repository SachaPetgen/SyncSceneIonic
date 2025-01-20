import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserRegisterDTO} from "../../models/User/DTO/UserRegisterDTO";
import {UserService} from "../../services/user.service";
import {catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private readonly userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('passwordConfirmation')?.value
      ? null
      : { mismatch: true };
  }

  login(): void {
    // Implement login logic here
  }

  register(registrationForm : FormGroup): void {
    if (registrationForm.valid) {

      const registrationData: UserRegisterDTO = registrationForm.value;
      const registrationObservable: Observable<any> = this.userService.register(registrationData);

      registrationObservable.pipe(
        tap({
          next: (response) => {
            console.log('User registered successfully:', response);
          },
          complete: () => {
            console.log('Registration process completed');
          }
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      console.log('Form is invalid');
    }
  }

  resetForms(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }
}
