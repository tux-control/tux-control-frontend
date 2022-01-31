import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { AuthorizedUser } from '../models/authorized-user';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(
      private authenticationService: AuthenticationService,
      private userStorageService: UserStorageService,
      private router: Router) {}

      canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> {
        return this.authenticationService.isLoggedIn
          .pipe(
            take(1),
            map((isLoggedIn: AuthorizedUser | null) => {
              if (isLoggedIn === null) {
                this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url }});
                return false;
              }

              if (next.data.permission && !this.userStorageService.hasPermission(next.data.permission)) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                return false;
              }

              return true;
            }));
      }
}
