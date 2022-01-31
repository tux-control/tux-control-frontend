import { Injectable } from '@angular/core';
import { AuthorizedUser } from '../models/authorized-user';
import { Permission } from '../models/permission';
import { Role } from '../models/role';


@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private localStorageKey = 'currentUser';
  constructor() {
  }

  getCurrentUser(): AuthorizedUser | null {
    try {
      const currentUserStorage = localStorage.getItem(this.localStorageKey);
      if (!currentUserStorage) {
        return null;
      }
      const authorizedUser = <AuthorizedUser>JSON.parse(currentUserStorage);
      authorizedUser.accessTokenExpires = (authorizedUser.accessTokenExpires ? new Date(authorizedUser.accessTokenExpires) : null);

      if (!this.isUserValid(authorizedUser)) {
        return null;
      }

      return authorizedUser;
    } catch (e) {
      return null;
    }
  }

  getAccessToken(): string | null {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return currentUser.accessToken;
    }
    return null;
  }

  getRefreshToken(): string | null {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return currentUser.refreshToken;
    }
    return null;
  }

  setCurrentUser(authorizedUser: AuthorizedUser): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(authorizedUser));
  }

  logOut(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  isUserValid(userInfo: AuthorizedUser): boolean {
    if (userInfo.accessTokenExpires === null) {
      return true;
    }

    const currentDate = new Date();
    const expirationDate = userInfo.accessTokenExpires;

    return (expirationDate > currentDate);
  }

  hasPermission(checkPermissions: string[], authorizedUser?: AuthorizedUser): boolean {
    const currentUser = authorizedUser || this.getCurrentUser();
    if (!currentUser) {
      return false; 
    }

    const permissionIdentifiers: string[] = [];

    currentUser.user.roles.forEach((role: Role) => {
      role.permissions.forEach((permission: Permission) => {
        if (!permissionIdentifiers.includes(permission.identifier)) {
          permissionIdentifiers.push(permission.identifier);
        }
      });
    });

    return checkPermissions.some(r=> permissionIdentifiers.includes(r))
  }
}
