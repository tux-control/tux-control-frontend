import { Injectable } from '@angular/core';
import { MySocket } from '@app/core/services/socketio.service';
import { ApiService } from './api.service';
import { Plugin } from '../models/plugin';
import { LazyLoadEvent } from 'primeng/api';
import { ResponseError } from '../models/response-error';


@Injectable({
  providedIn: 'root'
})

export class PluginService {
  public onListAll$ = this.socket.fromEvent<Plugin[]>('plugin/on-list-all');

  public onGet$ = this.socket.fromEvent<Plugin>('plugin/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('plugin/on-get-error');

  constructor(
    private socket: MySocket,
    private apiService: ApiService
  ) { }

  getPlugins() {
    this.socket.emit('plugin/do-list-all');
  }

  getPlugin(key: string) {
    this.socket.emit('plugin/do-get', {'key': key});
  }
}
