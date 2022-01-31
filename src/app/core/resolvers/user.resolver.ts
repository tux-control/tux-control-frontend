import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from '@app/core/services/user.service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.paramMap.get('userId');
    if (userId === null) {
      this.router.navigate(['/error/404']);
      return of(null);
    }

    return new Promise((resolve, reject) => {
      this.userService.onGet$.pipe(
        first()
      ).subscribe((user: User) => {
        resolve(user);
      });
      this.userService.getUser(userId);
    });
  }
}
