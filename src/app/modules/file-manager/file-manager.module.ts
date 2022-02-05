import { NgModule } from '@angular/core';

import { FileManagerComponent } from './pages/file/file-manager.component';
import { FileManagerRoutingModule } from './file-manager.routing';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    declarations: [
        FileManagerComponent,
    ],
    imports: [
        SharedModule,
        FileManagerRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class FileManagerModule {}
