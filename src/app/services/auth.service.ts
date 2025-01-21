import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {BehaviorSubject, Observable, from, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token-syncscene';
  private readonly USER_KEY = 'user-syncscene';
  private authState = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private async loadToken() {
    const {value: token} = await Preferences.get({key: this.TOKEN_KEY});
    this.tokenSubject.next(token);
    this.authState.next(!!token);
  }


  async debugStorage() {
    const allKeys = await Preferences.keys();
    console.log('All stored keys:', allKeys);

    for (const key of allKeys.keys) {
      const value = await Preferences.get({ key });
      console.log(`Key: ${key}, Value:`, value);
    }
  }


  async setToken(token: string) {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token
    });
    this.tokenSubject.next(token);
    this.authState.next(true);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async removeToken() {
    await Preferences.remove({ key: this.TOKEN_KEY });
    this.tokenSubject.next(null);
    this.authState.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getAuthToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  // Example logout method
  async logout() {
    await this.removeToken();
    await Preferences.remove({ key: this.USER_KEY });
    this.authState.next(false);
    this.tokenSubject.next(null);
  }

  async getCurrentUser() {

    this.getAuthToken().pipe(tap(token => {

        if(token != null){
          console.log(this.jwtHelper.decodeToken(token).sub);
        }
    }));
  }
}
