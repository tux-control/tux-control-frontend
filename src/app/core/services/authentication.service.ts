import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MySocket } from '@app/core/services/socketio.service';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { AuthorizedUser } from '../models/authorized-user';
import { User } from '../models/user';
import { ResponseError } from '../models/response-error';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<AuthorizedUser | null>(this.userStorageService.getCurrentUser());

  public onLogin$ = this.socket.fromEvent<AuthorizedUser>('authorization/on-login').pipe(map(user => {
    // login successful if there's a jwt token in the response
    if (user && user.accessToken) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.userStorageService.setCurrentUser(user);
      this.loggedIn.next(user);
    }

    return user;
  }));

  public onLoginError$ = this.socket.fromEvent<ResponseError>('authorization/on-login-error');
  public onGetCurrentUser$ = this.socket.fromEvent<User>('authorization/on-get-current-user');
  public onSetCurrentUser$ = this.socket.fromEvent<User>('authorization/on-set-current-user').pipe(map(user => {
    const updatedAuthorizedUser = this.userStorageService.getCurrentUser();
    if (user && updatedAuthorizedUser) {
      updatedAuthorizedUser.user = {...updatedAuthorizedUser.user, ...user};
      this.userStorageService.setCurrentUser(updatedAuthorizedUser);
    }
    return user;
  }));

  public onSetCurrentUserPassword$ = this.socket.fromEvent<User>('authorization/on-set-current-user-password');
  public onSetCurrentUserPasswordError$ = this.socket.fromEvent<ResponseError>('authorization/on-set-current-user-password-error');

  constructor(
    private socket: MySocket,
    private userStorageService: UserStorageService) {
  }

  login(email: string, password: string) {
    this.socket.emit('authorization/do-login', { email: email, password: password });
  }

  logOut(): void {
    // remove user from local storage to log user out
    this.loggedIn.next(null);
    this.userStorageService.logOut();
  }

  get isLoggedIn(): Observable<AuthorizedUser | null> {
    return this.loggedIn.asObservable();
  }

  updateCurrentUser(updateData: object) {
    this.socket.emit('authorization/do-set-current-user', updateData);
  }

  updateCurrentUserPassword(oldPassword: string, newPassword: string) {
    this.socket.emit('authorization/do-set-current-user-password', {
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  }

  getCurrentUser() {
    this.socket.emit('authorization/do-get-current-user');
  }
}
