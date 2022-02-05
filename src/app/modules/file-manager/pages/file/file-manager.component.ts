import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FileInfo } from '@app/core/models/file-info';
import { faTrash, faPen, faDownload, faInfo, faHome } from '@fortawesome/free-solid-svg-icons';

import { AlertService } from '@app/core/services/alert.service';
import { ActivatedRoute, Data } from '@angular/router';
import { FileService } from '@app/core/services/file.service';
import { ChunkUploadInfo } from '@app/core/models/chunk-upload-info';
import { FileUpload } from 'primeng/fileupload';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { ResponseError } from '@app/core/models/response-error';
import { FileInfoUpdateResponse } from '@app/core/models/file-info-update-response';


interface FileManagerItem {
  file: FileInfo;
  image: string;
  hasControls: boolean;
  routerLink?: string[];
  onDelete?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onInfo?: () => void;
  onClick: () => void;
  onClickThumbnail?: () => void;
}


@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit, OnDestroy {
  @ViewChild('eventLogDt') eventLogDt!: Table;
  private debounce: number = 400;
  private componentDestroyed$: Subject<boolean> = new Subject();

  videoPlayableMimeTypes: string[] = [
    'video/mp4',
    'video/webm',
    'video/ogg'
  ]
  @ViewChild('primeFileUpload') primeFileUpload!: FileUpload;
  breadcrumbs!: MenuItem[];
  homeBreadrumb = <MenuItem>{ icon: 'pi pi-home', routerLink: '/file-manager' };
  fileFormLoading: boolean = false;
  newFile: boolean = false;

  displayFileModifyDialog: boolean = false;
  displayFileInfoDialog: boolean = false;
  displayFilePreview: boolean = false;

  previewActiveIndex: number = 0;
  uploadedFiles: File[] = [];
  fileManagerLoading: boolean = false;

  fileFormGroup!: FormGroup;
  sortLocalStorageName: string = 'file-structure-sort-key';
  sortKey!: string;

  dataViewLayoutLocalStorageName: string = 'file-structure-layout-key';
  dataViewLayout!: string;

  sortOptions!: SelectItem[];
  
  fileManagerItems!: FileManagerItem[];
  fileManagerTotalRecords!: number;

  fileManagerLazyLoadEvent: LazyLoadEvent = <LazyLoadEvent>{};

  searchSubject: Subject<string> = new Subject<string>();

  selectedDirectory?: FileInfo;
  fileInfo?: FileInfo;


  faTrash = faTrash;
  faHome = faHome;
  faPen = faPen;
  faDownload = faDownload;
  faInfo = faInfo;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private fileService: FileService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit() {
    // Load sort from cookie
    this.sortKey = localStorage.getItem(this.sortLocalStorageName) || 'name';
    this.dataViewLayout = localStorage.getItem(this.dataViewLayoutLocalStorageName) || 'list';

    this.setSortSettings();
    this.sortOptions = [
      { label: $localize`Name descending`, value: '!name' },
      { label: $localize`Name ascending`, value: 'name' },
      { label: $localize`Created descending`, value: '!created' },
      { label: $localize`Created ascending`, value: 'created' },
      { label: $localize`Updated descending`, value: '!updated' },
      { label: $localize`Updated ascending`, value: 'updated' }
    ];

    this.activatedRoute.data.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((response: Data) => {
      if (response.fileInfo) {
        const fileInfo = <FileInfo>response.fileInfo;
        if (fileInfo.isDir) {
          this.selectedDirectory = fileInfo;
        } else if (fileInfo.isFile) {
          this.onDownloadFile(fileInfo);
        }
      }

      if (this.selectedDirectory) {
        this.breadcrumbs = [];
        this.selectedDirectory.parents?.reverse().forEach((parentFileInfo: FileInfo) => {
          this.breadcrumbs.push({
            label: parentFileInfo.name || 'root',
            routerLink: ['/file-manager', parentFileInfo.absolute]
          })
        });

        this.breadcrumbs.push({
          label: this.selectedDirectory.name,
          routerLink: ['/file-manager', this.selectedDirectory.absolute]
        });
      }

      this.lazyLoadFileManagerData();
    });

    this.searchSubject.pipe(
      debounceTime(this.debounce),
      distinctUntilChanged(),
      takeUntil(this.componentDestroyed$)
    )
      .subscribe(query => {
        if (query.length >= 2) {

          const filters = this.fileManagerLazyLoadEvent.filters || {};
          filters['name'] = {
            value: query,
            matchMode: 'contains'
          };
          this.fileManagerLazyLoadEvent.filters = filters;

          this.lazyLoadFileManagerData();
        } else if (query.length == 0) {
          // Reset to orignal state
          const filters = this.fileManagerLazyLoadEvent.filters || {};
          delete filters['name'];
          this.fileManagerLazyLoadEvent.filters = filters;

          this.lazyLoadFileManagerData();
        }
      });

    this.fileService.onIsFree$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((index: number | null) => {
        if (index) {
          this.primeFileUpload.files.splice(index, 1);
          this.alertService.error($localize`File with this name already exists in this directory.`, '');
        }
    });

    this.fileService.onIsFreeError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `Is path free failed.`, responseError.message);
    });


    this.fileService.onUpdate$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((fileInfoUpdateResponse: FileInfoUpdateResponse) => {
      // We need to clone the array
      const fileManagerItems = [...this.fileManagerItems];

      let foundIndex;
      if (fileInfoUpdateResponse.oldFileInfo){
        foundIndex = fileManagerItems.findIndex(x => x.file.absolute === fileInfoUpdateResponse.oldFileInfo.absolute);
      } else {
        foundIndex = -1;
      }

      if (foundIndex == -1) {
        fileManagerItems.push(this.fileInfoToFileManagerItem(fileInfoUpdateResponse.newFileInfo));
        if (fileInfoUpdateResponse.newFileInfo.isDir) {
          this.alertService.success($localize`Directory has been aded.`, 'OK');
        } else {
          // Well we TECHNICALLY can't add a file here but stil...
          this.alertService.success($localize`File has been aded.`, 'OK');
        }
      } else {
        fileManagerItems[foundIndex] = this.fileInfoToFileManagerItem(fileInfoUpdateResponse.newFileInfo);
        if (fileInfoUpdateResponse.newFileInfo.isDir) {
          this.alertService.success($localize`Directory was sucessfully modified.`, 'OK');
        } else {
          this.alertService.success($localize`File was sucessfully modified.`, 'OK');
        }
      }

      this.fileManagerItems = fileManagerItems;
      
      this.fileFormLoading = false;
      this.displayFileModifyDialog = false;
      this.fileInfo = <FileInfo>{};
    });

    this.fileService.onUpdateError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize`Failed to modify file.`, responseError.message);
      this.fileFormLoading = false;
    });

    this.fileService.onDelete$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((fileInfo: FileInfo) => {
      this.alertService.success($localize`File has been sucessfully deleted.`, 'OK');
      const foundIndex = this.fileManagerItems.findIndex(x => x.file.absolute === fileInfo.absolute);
      this.fileManagerItems = this.fileManagerItems.filter((_, i) => i !== foundIndex);
    });

    this.fileService.onDeleteError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize`Folder deletion failed.`, responseError.message);
    });

    this.fileService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((fileInfos: FileInfo[]) => {
      this.fileManagerItems = fileInfos.map((fileInfo: FileInfo) => {
        return this.fileInfoToFileManagerItem(fileInfo);
      });
      this.fileManagerLoading = false;
    });

    this.fileFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
  }

  get ffg() { return this.fileFormGroup.controls; }

  onDownloadFile(fileInfo: FileInfo): void {
    window.location.href = this.fileService.getDownloadUrl(fileInfo);
  }

  onDisplayPreview(fileInfo: FileInfo) {
    const foundIndex = this.fileManagerItems.findIndex(x => x.file.absolute === fileInfo.absolute);
    this.previewActiveIndex = foundIndex;
    this.displayFilePreview = true;
  }

  getFileThumbnail(fileInfo: FileInfo): string {
    if (fileInfo.isDir) {
      return 'assets/images/ico/folder.jpg';
    }

    return this.fileService.getThumbnailUrl(fileInfo);
  }

  getFileThumbnailUrl(fileInfo: FileInfo, size: string = '122x91'): string {
    return this.fileService.getThumbnailUrl(fileInfo, size);
  }

  getFileUrl(fileInfo: FileInfo) {
    return this.fileService.getFileUrl(fileInfo);
  }

  chunkedFileUploader(event: { [s: string]: File[] }): void {
    if (event.files.length) {
      event.files.forEach((file: File, index: number) => {
        this.fileService.beginFileUpload(this.selectedDirectory).pipe(
          takeUntil(this.componentDestroyed$)
        ).subscribe((chunkUploadInfo: ChunkUploadInfo) => {
          if (chunkUploadInfo.id) {
            this.chunkUploadFile(file, chunkUploadInfo.id, 2000000).then(() => {
              this.primeFileUpload.files.splice(index, 1);
            });
          }
        });
      });
    }
  }

  private async chunkUploadFile(file: File, id: string, chunkSize: number): Promise<void> {
    let index = 0;
    const chunks = Math.ceil(file.size / chunkSize) || 1;
    for (let offset = 0; offset < file.size; offset += chunkSize) {
      const chunk = file.slice(offset, offset + chunkSize);

      const chunkUploadInfo = await this.fileService.uploadFile(id, chunk, offset, file.size, index, chunks, file.name).toPromise();
      if (chunkUploadInfo.finished && chunkUploadInfo.file) {
        this.createFile(chunkUploadInfo.file);
      }
      this.primeFileUpload.onProgress.emit(Math.round((index + 1) / chunks * 100));

      index++;
    }
  }

  progressReport(event: any): void {
    this.primeFileUpload.progress = event;
  }

  onFileUploadSelect(event: any): void {
    event.currentFiles.forEach((file: File, index: number) => {
      this.fileService.checkIfPathIsFree(file.name, index, this.selectedDirectory);
    });
  }

  private createFile(fileInfo: FileInfo): void {
    const fileManagerItems = [...this.fileManagerItems];
    fileManagerItems.push(this.fileInfoToFileManagerItem(fileInfo));
    this.fileManagerItems = fileManagerItems;
  }

  onSubmitFileForm() {
    if (this.fileFormGroup.invalid || !this.fileInfo) {
      return;
    }
    this.fileFormLoading = true;
    const fileInfo = <FileInfo>{ ... this.fileInfo };
    fileInfo.name = this.ffg.name.value;

    fileInfo.parent = this.selectedDirectory;

    this.fileService.updateFile(fileInfo, this.fileInfo);
  }

  showDialogToAddFile() {
    this.fileFormLoading = false;
    this.fileInfo = <FileInfo>{};

    if (!this.newFile) {
      this.ffg.name.reset();
    }

    this.newFile = true;

    this.displayFileModifyDialog = true;
  }


  showDialogToEditFile(fileInfo: FileInfo) {
    this.displayFileModifyDialog = false;
    this.fileFormLoading = false;
    this.newFile = false;
    this.fileInfo = fileInfo;
    this.ffg.name.setValue(fileInfo.name);

    this.displayFileModifyDialog = true;
  }

  showFileInfoDialog(fileInfo: FileInfo) {
    this.fileInfo = fileInfo;
    this.displayFileInfoDialog = true;
  }

  lazyLoadFileManagerData() {
    this.fileManagerLoading = true;
    this.fileService.getFiles(this.fileManagerLazyLoadEvent, this.selectedDirectory);
  }

  private fileInfoToFileManagerItem(fileInfo: FileInfo): FileManagerItem {
    const onClick = (fileInfo.isFile ? (event: MouseEvent) => {
      event.preventDefault(); 
      event.stopPropagation();
      this.onDisplayPreview(fileInfo);
    }: undefined);

    const routerLink = (fileInfo.isDir ? ['/file-manager', fileInfo.absolute] : undefined);

    return <FileManagerItem>{
      file: fileInfo,
      image: this.getFileThumbnail(fileInfo),
      hasControls: true,
      onClick: onClick,
      routerLink: routerLink,
      onInfo: () => {
        this.showFileInfoDialog(fileInfo)
      },
      onDownload: () => {
        this.onDownloadFile(fileInfo)
      },
      onDelete: fileInfo.isWritable ? () => {
        this.onDeleteFile(fileInfo);
      } : null,
      onEdit: fileInfo.isWritable ? () => {
        this.showDialogToEditFile(fileInfo);
      } : null
    };
  }

  onDeleteFile(fileInfo: FileInfo) {
    this.confirmationService.confirm({
      message: $localize`Are you sure that you want to delete this folder?`,
      accept: () => {
        this.fileService.deleteFile(fileInfo);
      }
    });
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  setSortSettings() {
    if (this.sortKey.startsWith('!')) {
      this.fileManagerLazyLoadEvent.sortField = this.sortKey.replace('!', '');
      this.fileManagerLazyLoadEvent.sortOrder = -1;
    } else {
      this.fileManagerLazyLoadEvent.sortField = this.sortKey;
      this.fileManagerLazyLoadEvent.sortOrder = 1;
    }
  }

  onSortChange() {
    localStorage.setItem(this.sortLocalStorageName, this.sortKey);
    this.setSortSettings();
    this.lazyLoadFileManagerData();
  }

  onLayoutChange(layout: string) {
    localStorage.setItem(this.dataViewLayoutLocalStorageName, layout);
  }

  isFileWrite(fileInfo?: FileInfo | null): boolean {
    if (fileInfo && fileInfo.isWritable !== undefined) {
      return fileInfo.isWritable;
    }

    return true;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
