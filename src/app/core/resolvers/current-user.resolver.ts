import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<any> {
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      this.authenticationService.onGetCurrentUser$.pipe(
        first()
      ).subscribe((user: User) => {
        resolve(user);
      });
      this.authenticationService.getCurrentUser();
  });
  }
}
