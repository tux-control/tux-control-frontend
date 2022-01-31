import { NgModule } from '@angular/core';

import { AccountComponent } from './pages/account/account.component';

import { SettingsRoutingModule } from './settings.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        AccountComponent
    ],
    imports: [
        SharedModule,
        SettingsRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class SettingsModule {}
