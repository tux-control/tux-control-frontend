import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfigModule } from './app/app-config.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const currentLocation = window.location.href;
let configIdentifier = environment.name;
let currentHostname: string | null = null;

if (currentLocation) {
  const parsedCurrentLocation = new URL(currentLocation);
  const configNamespace = parsedCurrentLocation.searchParams.get('config.namespace');
  if (configNamespace) {
    configIdentifier = `${configNamespace}.${environment.name}`;
  }

  currentHostname = parsedCurrentLocation.hostname;
}

fetch(`/config/config.${configIdentifier}.json`).then(resp => resp.json()).then(config => {
  if (currentHostname) {
    config.socketioEndpoint = config.socketioEndpoint.replace('CURRENT_HOSTNAME', currentHostname);
    config.apiEndpoint = config.apiEndpoint.replace('CURRENT_HOSTNAME', currentHostname);
  }
  const appConfigModule = new AppConfigModule(config);
  platformBrowserDynamic([{ provide: AppConfigModule, useValue: appConfigModule }]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
