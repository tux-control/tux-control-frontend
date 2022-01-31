import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        SharedModule,
        DashboardRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class DashboardModule {}
