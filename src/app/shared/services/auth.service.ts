import {Injectable} from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import {BehaviorSubject, from, map, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  role: string;
  expiration: string;
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token-syncscene';

  private authState = new BehaviorSubject<boolean>(false);
  private token = new BehaviorSubject<string | null>(null);
  public currentUser = new BehaviorSubject<DecodedToken | null>(null);

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.loadToken();

    this.token.subscribe(token => {
      if (token) {
        const decodedUser = this.decodeToken(token);
        this.currentUser.next(decodedUser);
        this.authState.next(true);
      } else {
        this.currentUser.next(null);
        this.authState.next(false);
      }
    });
  }

  private async loadToken() {
    try {
      const { value: token } = await Preferences.get({ key: this.TOKEN_KEY });
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        this.token.next(token);
      } else if (token) {
        await this.logout();
      }
    } catch (error) {
      console.error('Error loading token:', error);
      await this.logout();
    }
  }

  async setToken(token: string) {
    try {
      await Preferences.set({
        key: this.TOKEN_KEY,
        value: token
      });
      this.token.next(token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  getToken(): Observable<string | null> {
    return from(Preferences.get({ key: this.TOKEN_KEY }))
      .pipe(map(result => result.value));
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getCurrentUser(): Observable<DecodedToken | null> {
    return this.currentUser.asObservable();
  }

  async logout() {
    try {
      await Preferences.remove({ key: this.TOKEN_KEY });

      this.token.next(null);
      this.authState.next(false);
      this.currentUser.next(null);

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return this.jwtHelper.decodeToken(token) as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.token.getValue();
    if (!token) return true;
    return this.jwtHelper.isTokenExpired(token);
  }
}
