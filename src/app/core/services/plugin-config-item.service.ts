import { Injectable } from '@angular/core';
import { MySocket } from '@app/core/services/socketio.service';
import { ApiService } from './api.service';
import { LazyLoadEvent } from 'primeng/api';
import { PluginConfigItem } from '../models/plugin-config-item';
import { PagedResult } from '../models/paged-result';
import { ResponseError } from '../models/response-error';
import { Plugin } from '../models/plugin';

import { BackendValidator } from '@app/core/models/validators/backend-validator';
import { BackendMaxLengthValidator } from '@app/core/models/validators/backend-max-length-validator';
import { BackendMaxValidator } from '@app/core/models/validators/backend-max-validator';
import { BackendMinLengthValidator } from '@app/core/models/validators/backend-min-length-validator';
import { BackendMinValidator } from '@app/core/models/validators/backend-min-validator';
import { BackendPatternValidator } from '@app/core/models/validators//backend-pattern-validator';
import { Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class PluginConfigItemService {
  public onListAll$ = this.socket.fromEvent<PagedResult<PluginConfigItem>>('plugin-config-item/on-list-all');
  public onListAllError$ = this.socket.fromEvent<ResponseError>('plugin-config-item/on-list-all-error')

  public onGet$ = this.socket.fromEvent<PluginConfigItem>('plugin-config-item/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('plugin-config-item/on-get-error');

  public onAdd$ = this.socket.fromEvent<PluginConfigItem>('plugin-config-item/on-add');
  public onAddError$ = this.socket.fromEvent<ResponseError>('plugin-config-item/on-add-error');

  public onSet$ = this.socket.fromEvent<PluginConfigItem>('plugin-config-item/on-set');
  public onSetError$ = this.socket.fromEvent<ResponseError>('plugin-config-item/on-set-error');

  constructor(
    private socket: MySocket,
    private apiService: ApiService
  ) { }

  getPluginConfigItems(event: LazyLoadEvent, plugin: Plugin) {
    const filters = this.apiService.gridEventToApi(event);
    this.socket.emit('plugin-config-item/do-list-all', {
      filters: filters,
      pluginKey: plugin.key
    });
  }

  getPluginConfigItem(key: string, plugin: Plugin | string) {
    this.socket.emit('plugin-config-item/do-get', {
      pluginKey: (typeof plugin === 'string' ? plugin : plugin.key),
      key: key
    });
  }

  setPluginConfigItem(pluginConfigItem: PluginConfigItem, plugin: Plugin | string) {
    this.socket.emit('plugin-config-item/do-set', {
      pluginKey: (typeof plugin === 'string' ? plugin : plugin.key),
      pluginConfigItem: pluginConfigItem
    });
  }

  addPluginConfigItem(pluginConfigItem: PluginConfigItem, plugin: Plugin | string) {
    this.socket.emit('plugin-config-item/do-add', {
      pluginKey: (typeof plugin === 'string' ? plugin : plugin.key),
      pluginConfigItem: pluginConfigItem
    });
  }

  processValidators(backednValidators: BackendValidator[]) {
    return backednValidators.map((validatorRaw: BackendValidator) => {
      let validatorInfo;
      switch(validatorRaw.name) {
        case 'email':
          return Validators.email;
          break;

        case 'maxlength':
          validatorInfo = <BackendMaxLengthValidator>validatorRaw;
          return Validators.maxLength(validatorInfo.maxLength);
          break;

        case 'max':
          validatorInfo = <BackendMaxValidator>validatorRaw;
          return Validators.max(validatorInfo.maxValue);
          break;

        case 'minlength':
          validatorInfo = <BackendMinLengthValidator>validatorRaw;
          return Validators.minLength(validatorInfo.minLength);
          break;

        case 'min':
          validatorInfo = <BackendMinValidator>validatorRaw;
          return Validators.min(validatorInfo.minValue);
          break;

        case 'pattern':
          validatorInfo = <BackendPatternValidator>validatorRaw;
          return Validators.pattern(validatorInfo.pattern);
          break;

        case 'required':
          return Validators.required;
          break;

        default:
          throw Error(`Unknown validator name ${validatorRaw.name}`);
          break;
      }
    });
  }

}
