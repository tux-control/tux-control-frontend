import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileListComponent } from './file-list.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule, 
        DropdownModule,
        DataViewModule, 
        ButtonModule, 
        SharedModule, 
        BreadcrumbModule, 
        FormsModule,
        InputTextModule,
        FontAwesomeModule
    ],
    exports: [SharedModule, DropdownModule, ButtonModule, DataViewModule, FormsModule, BreadcrumbModule, InputTextModule, FontAwesomeModule, FileListComponent],
    declarations: [FileListComponent]
})
export class FileListModule { }