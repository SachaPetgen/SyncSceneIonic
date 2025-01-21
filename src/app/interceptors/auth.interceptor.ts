import { HttpInterceptorFn } from '@angular/common/http';
import {from, switchMap} from "rxjs";
import {Preferences} from "@capacitor/preferences";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: 'auth-token' })).pipe(
    switchMap(({ value: token }) => {
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
