import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy, TemplateRef, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { FileInfo } from '@app/core/models/file-info';
import { LazyLoadEvent, MenuItem, PrimeTemplate, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { faTrash, faPen, faDownload, faInfo, faHome } from '@fortawesome/free-solid-svg-icons';

export interface FileManagerLazyLoadEvent {
  lazyLoadEvent: LazyLoadEvent;
  parentFileItem?: FileInfo;
}

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {
  @Input() fileItems: FileInfo[] = [];
  @Input() loading: boolean = false;
  @Input() selectedFileItem?: FileInfo;
  @Input() defaultParentFileItem!: FileInfo;
  @Input() parentFileItem?: FileInfo;
  @Input() onGetThumbnailUrl!: (fileItem: FileInfo) => string;

  @Output() onLazyLoad = new EventEmitter<FileManagerLazyLoadEvent>();
  @Output() onClick = new EventEmitter<FileInfo>();

  @ContentChildren(PrimeTemplate) templates!: QueryList<any>;

  private debounce: number = 400;
  private componentDestroyed$: Subject<boolean> = new Subject();
  private searchSubject: Subject<string> = new Subject<string>();

  public buttonsTemplate!: TemplateRef<any>;
  public itemButtonsTemplate!: TemplateRef<any>;

  searchValue?: string;

  breadcrumbs!: MenuItem[];
  homeBreadrumb = <MenuItem>{ icon: 'pi pi-home', command: () => {
    this.onFileManagerItemClick(this.defaultParentFileItem);
  } };
  
  sortLocalStorageName: string = 'file-structure-sort-key';
  sortKey!: string;

  dataViewLayoutLocalStorageName: string = 'file-structure-layout-key';
  dataViewLayout!: string;

  sortOptions!: SelectItem[];
  
  
  fileManagerTotalRecords!: number;

  fileManagerLazyLoadEvent: LazyLoadEvent = <LazyLoadEvent>{};

  faTrash = faTrash;
  faHome = faHome;
  faPen = faPen;
  faDownload = faDownload;
  faInfo = faInfo;

  constructor(
  ) {}

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
  }

  setSearchValue(value?: string): void {
    this.searchValue = value;
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
        switch(item.getType()) {
            case 'buttons':
                this.buttonsTemplate = item.template;
            break;

            case 'itemButtons':
              this.itemButtonsTemplate = item.template;
            break;
        }
    });
}

  ngOnChanges(changes: SimpleChanges) {
    if ('defaultParentFileItem' in changes && changes['defaultParentFileItem'].currentValue != changes['defaultParentFileItem'].previousValue) {
      this.parentFileItem = this.defaultParentFileItem;
      this.onSetParentFileItem();
    } else if ('parentFileItem' in changes && changes['parentFileItem'].currentValue != changes['parentFileItem'].previousValue) {
      this.onSetParentFileItem();
    }
  }

  private onSetParentFileItem() {
    if (this.parentFileItem) {
      this.breadcrumbs = [];
      this.parentFileItem.parents?.reverse().forEach((fileInfo: FileInfo) => {
        this.breadcrumbs.push({
          label: fileInfo.name || 'root',
          command: () => {
            this.onFileManagerItemClick(fileInfo);
          }
        })
      });

      this.breadcrumbs.push({
        label: this.parentFileItem.name,
        command: () => {
          if (this.parentFileItem) this.onFileManagerItemClick(this.parentFileItem);
        }
      });

      // Reset filets on parent change
      this.fileManagerLazyLoadEvent.filters = {};
      this.setSearchValue();

      this.lazyLoadFileManagerData();
    }
  }

  lazyLoadFileManagerData() {
    this.loading = true;
    this.onLazyLoad.emit({
      lazyLoadEvent: this.fileManagerLazyLoadEvent,
      parentFileItem: this.parentFileItem
    });
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  onFileManagerItemClick(fileManagerItem: FileInfo) {
    this.onClick.emit(fileManagerItem);
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

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
