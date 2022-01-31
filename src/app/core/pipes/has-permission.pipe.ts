import { Pipe, PipeTransform } from '@angular/core';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { AuthorizedUser } from '../models/authorized-user';
@Pipe({name: 'hasPermission'})
export class HasPermissionPipe implements PipeTransform {
  constructor(
    private userStorageService: UserStorageService
  ) {}


  transform(permissionIdentifier: string[], authorizedUser?: AuthorizedUser): boolean {
    return this.userStorageService.hasPermission(permissionIdentifier, authorizedUser);
  }
}
