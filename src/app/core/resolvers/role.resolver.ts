import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { RoleService } from '@app/core/services/role.service';
import { Role } from '../models/role';


@Injectable({
  providedIn: 'root'
})
export class RoleResolver implements Resolve<any> {

  constructor(
    private roleService: RoleService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const roleId = route.paramMap.get('roleId');
    if (roleId === null) {
      this.router.navigate(['/error/404']);
      return of(null);
    }

    return new Promise((resolve, reject) => {
      this.roleService.onGet$.pipe(
        first()
      ).subscribe((role: Role) => {
        resolve(role);
      });
      this.roleService.getRole(roleId);
    });
  }
}
