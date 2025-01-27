import { Routes } from '@angular/router';
import {authGuard, publicGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.page').then( m => m.EventsPage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then( m => m.AuthPage),
    canActivate: [publicGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.page').then( m => m.AccountPage),
    canActivate: [authGuard]
  }
];
