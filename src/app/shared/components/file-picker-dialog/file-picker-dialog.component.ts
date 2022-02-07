import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileInfo } from '@app/core/models/file-info';
import { FileService } from '@app/core/services/file.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileManagerLazyLoadEvent } from '../file-list/file-list.component';

export enum PickerType {
  ALL = 'all',
  FILE = 'file',
  DIRECTORY = 'directory'
}

@Component({
  selector: 'app-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.scss']
})
export class FilePickerDialogComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  fileManagerItems!: FileInfo[];
  defaultParentFileItem!: FileInfo;
  parentFileItem?: FileInfo;
  fileManagerLoading!: boolean;

  selectedFile?: FileInfo;
 
  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.fileService.onGetDefault$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((fileInfo: FileInfo) => {
      this.defaultParentFileItem = fileInfo;
    });

    this.fileService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((fileInfos: FileInfo[]) => {
      // Filter

      if (this.dynamicDialogConfig.data.pickerType == PickerType.DIRECTORY) {
        this.fileManagerItems = fileInfos.filter((fileInfo: FileInfo) => fileInfo.isDir);
      } else if(this.dynamicDialogConfig.data.pickerType == PickerType.FILE && this.dynamicDialogConfig.data.matchMimeTypes) {
          this.fileManagerItems = fileInfos.filter((fileInfo: FileInfo) => (!fileInfo.mimeType || this.dynamicDialogConfig.data.matchMimeTypes.some((mimeTypeSearch: string) => {return fileInfo.mimeType.startsWith(mimeTypeSearch)}) ));
      } else {
        this.fileManagerItems = fileInfos;
      }

      this.fileManagerLoading = false;
    });

    this.fileService.getDefaultFile();
  }


  onLazyLoad(fileManagerlazyLoadEvent: FileManagerLazyLoadEvent) {
    this.fileManagerLoading = true;
    this.fileService.getFiles(fileManagerlazyLoadEvent.lazyLoadEvent, fileManagerlazyLoadEvent.parentFileItem);
  }

  onClick(fileInfo: FileInfo) {
    if (fileInfo.isDir) {
      this.parentFileItem = fileInfo;
    }

    if (
      (this.dynamicDialogConfig.data.pickerType == PickerType.DIRECTORY && fileInfo.isDir) || 
      (this.dynamicDialogConfig.data.pickerType == PickerType.FILE && fileInfo.isFile)
    ) {
      this.selectedFile = fileInfo;
    }
  }

  getFileThumbnail = (fileInfo: FileInfo): string => {
    if (fileInfo.isDir) {
      return 'assets/images/ico/folder.jpg';
    }

    return this.fileService.getThumbnailUrl(fileInfo);
  }

  getFileThumbnailUrl(fileInfo: FileInfo, size: string = '122x91'): string {
    return this.fileService.getThumbnailUrl(fileInfo, size);
  }

  onItemSelected() {
    if (this.selectedFile) {
      this.dynamicDialogRef.close(this.selectedFile);
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
