import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { FileInputComponent } from './file-input.component';
import { FormsModule } from '@angular/forms';
import { FilePickerDialogModule } from '../file-picker-dialog/file-picker-dialog.module';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    imports: [
        CommonModule, 
        ButtonModule, 
        SharedModule, 
        FormsModule,
        DialogModule,
        InputTextModule,
        FilePickerDialogModule
    ],
    exports: [SharedModule, ButtonModule, FormsModule, InputTextModule, DialogModule, FilePickerDialogModule, FileInputComponent],
    declarations: [FileInputComponent]
})
export class FileInputModule { }