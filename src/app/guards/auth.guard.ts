import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {map, tap} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    map(authenticated => {
      console.log('AuthGuard - authenticated:', authenticated);
      console.log('AuthGuard - current route:', route.url);

      if (!authenticated) {
        router.navigate(['/auth']);
        return false;
      }
      return true;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {  // Changed from tap to map
      console.log('PublicGuard - authenticated:', isAuthenticated);
      console.log('PublicGuard - current route:', route.url);

      if (isAuthenticated) {
        router.navigate(['/account']);
        return false;
      }
      // Explicitly return true to allow access to auth page
      console.log('PublicGuard - allowing access to auth page');
      return true;
    })
  );
};
