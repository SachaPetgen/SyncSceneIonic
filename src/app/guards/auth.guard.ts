import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {map} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    map(authenticated => {
      if (!authenticated) {
        router.navigate(['/auth']).then(() => console.log('Redirected to auth page via guard'));
        return false;
      }
      return true;
    })
  );
};
