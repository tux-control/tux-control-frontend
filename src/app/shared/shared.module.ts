
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
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
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


import { OrganizationChartModule } from 'primeng/organizationchart';
import { CalendarLocaleDirective } from '@app/core/directives/calendar.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ByteFormatterPipe } from '@app/core/pipes/byte-formatter.pipe';
import { GravatarPipe } from '@app/core/pipes/gravatar.pipe';
import { HasPermissionPipe } from '@app/core/pipes/has-permission.pipe';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,

      AutoCompleteModule,
      DropdownModule,
      TableModule,
      ButtonModule
    ],
    declarations: [
      CalendarLocaleDirective,
      ByteFormatterPipe,
      GravatarPipe,
      HasPermissionPipe
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
      DynamicDialogModule,
      FieldsetModule,
      OrganizationChartModule,
      AccordionModule,
      ToolbarModule,
      ContextMenuModule,
      ChipsModule,
      DividerModule,
      SliderModule,
      ListboxModule,
      TagModule,
      CalendarLocaleDirective,
      FontAwesomeModule,
      ByteFormatterPipe,
      GravatarPipe,
      HasPermissionPipe,
    ],
    entryComponents: [
    ]
})
export class SharedModule { }
