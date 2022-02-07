
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ListboxModule } from 'primeng/listbox';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ChipsModule } from 'primeng/chips';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DataViewModule } from 'primeng/dataview';


import { OrganizationChartModule } from 'primeng/organizationchart';
import { CalendarLocaleDirective } from '@app/core/directives/calendar.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormatBytesPipe } from '@app/core/pipes/format-bytes.pipe';
import { GravatarPipe } from '@app/core/pipes/gravatar.pipe';
import { HasPermissionPipe } from '@app/core/pipes/has-permission.pipe';
import { ShortTextPipe } from '@app/core/pipes/short-text.pipe';

import { FileListModule } from './components/file-list/file-list.module';
import { FilePickerDialogModule } from './components/file-picker-dialog/file-picker-dialog.module';
import { FileInputModule } from './components/file-input/file-input.module';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
    ],
    declarations: [
      CalendarLocaleDirective,
      FormatBytesPipe,
      GravatarPipe,
      HasPermissionPipe,
      ShortTextPipe
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      ConfirmDialogModule,
      TableModule,
      DialogModule,
      PasswordModule,
      InputTextModule,
      InputTextareaModule,
      CheckboxModule,
      AutoCompleteModule,
      MessagesModule,
      SelectButtonModule,
      CalendarModule,
      DropdownModule,
      InputMaskModule,
      FileUploadModule,
      MultiSelectModule,
      ToggleButtonModule,
      ButtonModule,
      TooltipModule,
      FieldsetModule,
      OrganizationChartModule,
      AccordionModule,
      ToolbarModule,
      ContextMenuModule,
      ChipsModule,
      DividerModule,
      SliderModule,
      ListboxModule,
      GalleriaModule,
      TagModule,
      BreadcrumbModule,
      DataViewModule,

      FileListModule,
      FilePickerDialogModule,
      FileInputModule,

      CalendarLocaleDirective,
      FontAwesomeModule,
      FormatBytesPipe,
      GravatarPipe,
      HasPermissionPipe,
      ShortTextPipe,
    ],
    entryComponents: [
    ]
})
export class SharedModule { }
