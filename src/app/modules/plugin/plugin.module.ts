import { NgModule } from '@angular/core';

import { PluginComponent } from './pages/plugin/plugin.component';
import { EditComponent } from './pages/edit/edit.component';
import { NewComponent } from './pages/new/new.component';
import { PluginRoutingModule } from './plugin.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        PluginComponent,
        EditComponent,
        NewComponent
    ],
    imports: [
        SharedModule,
        PluginRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class PluginModule {}
