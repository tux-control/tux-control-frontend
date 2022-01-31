import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { AppConfigModule } from '@app/app-config.module';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { ApiService } from '@app/core/services/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MySocket extends Socket {
    constructor(
      private userStorageService: UserStorageService,
      private appConfigModule: AppConfigModule
    ) {
        super(<SocketIoConfig>{ url: appConfigModule.config.socketioEndpoint, options: {} });
    }

    on(eventName: string, callback: Function) {
        return super.on(eventName, callback);
    }

    emit(eventName: string, message?: any, callback?: Function) {
        message = message || {};
        message['accessToken'] = this.userStorageService.getAccessToken();
        const message_converted = ApiService.createConverterFunction(ApiService.camelCaseToSnakeCase)(message);
        if (callback) {
          return super.emit(eventName, message_converted, callback);
        } else {
          return super.emit(eventName, message_converted);
        }
    }

    fromEvent<T>(eventName: string): Observable<T> {
        return super.fromEvent(eventName).pipe(
          map((data) => {
            return ApiService.createConverterFunction(ApiService.snakeCaseToCamelCase)(data);
          }));
    }

}
