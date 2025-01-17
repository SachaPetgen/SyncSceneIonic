import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {UserRegisterDTO} from "../../../models/User/DTO/UserRegisterDTO";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Gender} from "../../../models/User/User";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-user-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe
  ]
})
export class RegisterComponent  implements OnInit {

  registrationForm: FormGroup;
  genderNames = Gender;

  constructor(private userService: UserService) {

    this.registrationForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirmation: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]), // assuming 10-digit phone numbers
      birthDate: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required)
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator : ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;

    if (password !== passwordConfirmation) {
      return { mismatch: true };
    }

    return null;
  };

  ngOnInit() {
    console.log("RegisterComponent initialized");
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {

      const registrationData: UserRegisterDTO = this.registrationForm.value;
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
}
