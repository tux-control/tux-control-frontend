import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';

import * as Sentry from "@sentry/browser";
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MySocket } from '@app/core/services/socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { environment } from '../environments/environment';
import { HeaderComponent } from './layouts/header/header.component';


registerLocaleData(localeCs, 'cs');

Sentry.init({
  dsn: ''
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {

  constructor() {}
  handleError(error: any) {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    const rawLastReloadTime = localStorage.getItem('lastReloadTime') || '1996-10-15T00:05:32.000Z';
    const lastReloadTime = new Date(rawLastReloadTime);
    const now = new Date();
    const lastReloadDiff = (now.getTime() - lastReloadTime.getTime()) / 1000;

    if (chunkFailedMessage.test(error.message) && lastReloadDiff > 600) {
        localStorage.setItem('lastReloadTime', now.toISOString());
        window.location.reload();
    } else {
      const eventId = Sentry.captureException(error.originalError || error);
      //Sentry.showReportDialog({ eventId });
    }
  }
}


@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent
  ],
  imports: [
    // angular
    BrowserModule,
    SocketIoModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app
    AppRoutingModule,

    // Primeng
    ToastModule,
    ScrollPanelModule,
    PanelMenuModule,
    MenubarModule,

    BrowserAnimationsModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    MySocket,
    { provide: ErrorHandler, useClass: environment.production ? SentryErrorHandler : ErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
