import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../shared/services/auth.service";
import {inject} from "@angular/core";
import {map, tap} from "rxjs";

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/account']);
        return false;
      }
      return true;
    })
  );
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth']);
        return false;
      }
      return true;
    })
  );
};
