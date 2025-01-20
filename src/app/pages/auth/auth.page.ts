import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonDatetime } from '@ionic/angular';
import { AuthService } from './auth.service';
import {Gender} from "../../models/User/User";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class AuthPage {
  @ViewChild(IonDatetime) datetime!: IonDatetime;
  currentForm: 'login' | 'register' = 'login';
  Gender = Gender;
  datePickerOpen = false;

  constructor(public authService: AuthService) {}

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

      this.authService.registerForm.patchValue({
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

  onLogin(): void {
    if (this.authService.loginForm.valid) {
      console.log('Login form submitted', this.authService.loginForm.value);
      this.authService.login();
    }
  }

  onRegister(): void {
    if (this.authService.registerForm.valid) {
      console.log('Register form submitted', this.authService.registerForm.value);
      this.authService.register(this.authService.registerForm);
    }
  }
}
