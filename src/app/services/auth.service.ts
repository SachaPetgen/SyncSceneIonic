import {Injectable, OnInit} from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import {BehaviorSubject, Observable, from, tap, map, firstValueFrom} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserTokenDTO} from "../models/User/DTO/UserTokenDTO";

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  role: string;
  expiration: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly TOKEN_KEY = 'auth-token-syncscene';
  private readonly USER_KEY = 'user-syncscene';

  private authState = new BehaviorSubject<boolean>(false);
  private token = new BehaviorSubject<string | null>(null);

  public currentUser = new BehaviorSubject<DecodedToken | null>(null);

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {

    this.loadToken();

    this.token.subscribe(async token => {
      console.log('Token changed:', token);
      if (token) {
        this.currentUser.next(this.getUserTokenDTOFromToken(token));
        console.log(this.currentUser.value);
      }
    });

  }

  private async loadToken() {
    const {value: token} = await Preferences.get({key: this.TOKEN_KEY});
    this.token.next(token);
    this.authState.next(!!token);
  }


  async debugStorage() {
    const allKeys = await Preferences.keys();

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
    this.token.next(token);
    this.authState.next(true);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async removeToken() {
    await Preferences.remove({ key: this.TOKEN_KEY });
    this.token.next(null);
    this.authState.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Example logout method
  async logout() {
    await this.removeToken();
    await Preferences.remove({ key: this.USER_KEY });
  }

  decodeToken(token: string) : DecodedToken | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      if (!decoded) {
        return null;
      }
      return decoded as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserTokenDTOFromToken(token: string): DecodedToken | null {
    const decodedToken = this.decodeToken(token);

    console.log(decodedToken);

    return decodedToken ? {
      id: decodedToken.id,
      email: decodedToken.email,
      username: decodedToken.username,
      role: decodedToken.role,
      expiration: decodedToken.expiration
    } : null;
  }
}
