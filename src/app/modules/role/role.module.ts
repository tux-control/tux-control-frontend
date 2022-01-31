import { NgModule } from '@angular/core';

import { RoleComponent } from './pages/role/role.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { RoleRoutingModule } from './role.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        RoleComponent,
        NewComponent,
        EditComponent
    ],
    imports: [
        SharedModule,
        RoleRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class RoleModule {}
