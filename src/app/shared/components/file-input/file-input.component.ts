import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FileInfo } from '@app/core/models/file-info';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FilePickerDialogComponent, PickerType } from '../file-picker-dialog/file-picker-dialog.component';


export const FILE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileInputComponent),
  multi: true
};

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [FILE_INPUT_VALUE_ACCESSOR],
})
export class FileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private componentDestroyed$: Subject<boolean> = new Subject();
  @Input() pickerType: PickerType | string = PickerType.ALL;
  @Input() title: string = $localize `Select File`;
  @Input() disabled: boolean = false;
  @Input() matchMimeTypes?: string[];
  @Input() placeholder?: string;
  @Input() tabindex?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() required?: boolean;
  @Input() autocomplete?: string;

  @Output() onInput: EventEmitter<Event> = new EventEmitter();
  @Output() onInputFileInfo: EventEmitter<FileInfo> = new EventEmitter();
  
  @ViewChild('input', { static: true }) inputViewChild!: ElementRef;
  
  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};


  value?: string;

  constructor(
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
  }


  onButtonClick(event: MouseEvent) {
    const ref = this.dialogService.open(FilePickerDialogComponent, {
      header: this.title,
      width: '70%',
      data: {
        pickerType: this.pickerType,
        matchMimeTypes: this.matchMimeTypes
      }
  });

  ref.onClose.pipe(
    takeUntil(this.componentDestroyed$)
  ).subscribe((fileInfo: FileInfo) => {
    this.onInputFileInfo.emit(fileInfo);
    this.writeValue(fileInfo.absolute);
    this.onModelChange(this.value);
  });
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
    this.cd.markForCheck();
  }

  onInputChange(event: Event) {
    this.handleInputChange(event);
    this.onInput.emit(event);
  }

  onInputBlur(event: FocusEvent) { 
    this.onModelTouched();
  }

  handleInputChange(event: InputEvent | ClipboardEvent | Event) {
    setTimeout(() => {
      this.updateModel(event);
    }, 0);
  }

  updateModel(event: InputEvent | ClipboardEvent | Event) {
    const target = <HTMLInputElement>event.target;
    const updatedValue = target.value;
    if (updatedValue !== null || updatedValue !== undefined) {
        this.value = updatedValue;
        this.onModelChange(this.value);
    }
  }

  writeValue(value: string) : void {
      this.value = value;

      if (this.inputViewChild && this.inputViewChild.nativeElement) {
          if (this.value == undefined || this.value == null)
              this.inputViewChild.nativeElement.value = '';
          else
              this.inputViewChild.nativeElement.value = this.value;
      }
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
