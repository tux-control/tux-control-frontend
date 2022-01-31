import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LazyLoadEvent } from 'primeng/api';
import { PagedResult } from '../models/paged-result';
import { Permission } from '../models/permission';
import { ResponseError } from '../models/response-error';
import { MySocket } from './socketio.service';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public onListAll$ = this.socket.fromEvent<PagedResult<Permission>>('permission/on-list-all');

  public onGet$ = this.socket.fromEvent<Permission>('permission/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('permission/on-get-error');

  constructor(
    private socket: MySocket,
    private apiService: ApiService
  ) { }

  getPermissions(params: LazyLoadEvent) {
    this.socket.emit('permission/do-list-all', this.apiService.gridEventToApi(params));
  }

  getPermission(id: string) {
    this.socket.emit('permission/do-get', {'id': id});
  }
}
