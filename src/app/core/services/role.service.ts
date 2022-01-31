import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { ApiService } from './api.service';
import { LazyLoadEvent } from 'primeng/api';
import { PagedResult } from '../models/paged-result';
import { ResponseError } from '../models/response-error';
import { MySocket } from './socketio.service';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public onListAll$ = this.socket.fromEvent<PagedResult<Role>>('role/on-list-all');

  public onDelete$ = this.socket.fromEvent<Role>('role/on-delete');
  public onDeleteError$ = this.socket.fromEvent<ResponseError>('role/on-delete-error');

  public onCreate$ = this.socket.fromEvent<Role>('role/on-create');
  public onCreateError$ = this.socket.fromEvent<ResponseError>('role/on-create-error');

  public onUpdate$ = this.socket.fromEvent<Role>('role/on-update');
  public onUpdateError$ = this.socket.fromEvent<ResponseError>('role/on-update-error');

  public onGet$ = this.socket.fromEvent<Role>('role/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('role/on-get-error');

  constructor(
    private socket: MySocket,
    private apiService: ApiService
  ) { }

  getRoles(params: LazyLoadEvent) {
    this.socket.emit('role/do-list-all', this.apiService.gridEventToApi(params));
  }

  getRole(id: string) {
    this.socket.emit('role/do-get', {'id': id});
  }

  updateRole(role: Role) {
    this.socket.emit('role/do-update', role);
  }

  addRole(role: Role) {
    this.socket.emit('role/do-create', role);
  }

  deleteRole(role: Role) {
    this.socket.emit('role/do-delete', role);
  }
}
