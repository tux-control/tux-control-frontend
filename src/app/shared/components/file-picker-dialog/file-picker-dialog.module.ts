import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { FilePickerDialogComponent } from './file-picker-dialog.component';
import { FileListModule } from '../file-list/file-list.module';


@NgModule({
    imports: [
        CommonModule, 
        ButtonModule, 
        SharedModule,
        FileListModule,
        //DynamicDialogModule
    ],
    exports: [SharedModule, ButtonModule, FileListModule, /*DynamicDialogModule,*/ FilePickerDialogComponent],
    declarations: [FilePickerDialogComponent]
})
export class FilePickerDialogModule { }