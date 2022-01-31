import { NgModule } from '@angular/core';

import { UserComponent } from './pages/user/user.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { UserRoutingModule } from './user.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        UserComponent,
        NewComponent,
        EditComponent
    ],
    imports: [
        SharedModule,
        UserRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class UserModule {}
