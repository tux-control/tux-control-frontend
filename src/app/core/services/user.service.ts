import { Injectable } from '@angular/core';
import { MySocket } from '@app/core/services/socketio.service';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { LazyLoadEvent } from 'primeng/api';
import { PagedResult } from '../models/paged-result';
import { ResponseError } from '../models/response-error';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  public onListAll$ = this.socket.fromEvent<PagedResult<User>>('user/on-list-all');

  public onDelete$ = this.socket.fromEvent<User>('user/on-delete');
  public onDeleteError$ = this.socket.fromEvent<ResponseError>('user/on-delete-error');

  public onCreate$ = this.socket.fromEvent<User>('user/on-create');
  public onCreateError$ = this.socket.fromEvent<ResponseError>('user/on-create-error');

  public onUpdate$ = this.socket.fromEvent<User>('user/on-update');
  public onUpdateError$ = this.socket.fromEvent<ResponseError>('user/on-update-error');

  public onGet$ = this.socket.fromEvent<User>('user/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('user/on-get-error');

  constructor(
    private socket: MySocket,
    private apiService: ApiService
  ) { }

  getUsers(params: LazyLoadEvent) {
    this.socket.emit('user/do-list-all', this.apiService.gridEventToApi(params));
  }

  getUser(id: string) {
    this.socket.emit('user/do-get', {'id': id});
  }

  updateUser (user: User) {
    this.socket.emit('user/do-update', user);
  }

  addUser (user: User) {
    this.socket.emit('user/do-create', user);
  }

  deleteUser (user: User) {
    this.socket.emit('user/do-delete', user);
  }

  searchUser(query: string) {
    this.socket.emit('user/do-search', {'query': query});
  }
}
