import { IAppConfig } from '@app/core/models/app-config';


export class AppConfigModule {
  config: IAppConfig;
  constructor(
    config: IAppConfig,
  ) {
    this.config = config;
  }
}
