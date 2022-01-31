import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '@app/core/services/alert.service';
import { Plugin } from '@app/core/models/plugin';
import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { PluginConfigItem } from '@app/core/models/plugin-config-item';
import { PluginConfigItemService } from '@app/core/services/plugin-config-item.service';
import { PagedResult } from '@app/core/models/paged-result';
import { ResponseError } from '@app/core/models/response-error';
import { ApiService } from '@app/core/services/api.service';
import { GridColumn } from '@app/core/models/grid-column';


@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit, AfterViewInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  private isReloading = new BehaviorSubject<boolean>(false);
  private isReloading$ = this.isReloading.asObservable();
  plugin!: Plugin;
  @ViewChild('dt') dt!: Table;
  pluginConfigItems!: PluginConfigItem[];
  selectedPluginConfigItems!: PluginConfigItem[];
  totalRecords!: number;
  gridLoading!: boolean;
  reloading : boolean = false;
  cols!: any[];


  constructor(
    private confirmationService: ConfirmationService,
    private pluginConfigItemService: PluginConfigItemService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.data.subscribe((data: Data) => {
      this.plugin = {... <Plugin>data.plugin};

      this.cols = this.plugin.gridColumns.map((gridColumn: GridColumn) => {
        gridColumn.field = ApiService.snakeCaseToCamelCase(gridColumn.field);
        return gridColumn;
      });
     
      this.isReloading.next(true);
    });

    this.gridLoading = true;
    this.pluginConfigItemService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((pagedResultPluginConfigItem: PagedResult<PluginConfigItem>) => {
      this.gridLoading = false;
      this.pluginConfigItems = pagedResultPluginConfigItem.data;
      this.totalRecords = pagedResultPluginConfigItem.total;
    });

    this.pluginConfigItemService.onListAllError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error(responseError.code.toString(), responseError.message);
      this.gridLoading = false;
      this.pluginConfigItems = [];
      this.totalRecords = 0;
    });
  }

  get stateKey(): string {
    return `plugin-storage-${this.plugin.key}`;
  }

  ngAfterViewInit(): void {
    this.isReloading$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((value: boolean) => {
      if (value) {
        this.dt.reset();
        this.loadPluginConfigItemsLazy(<LazyLoadEvent>{
          filters: this.dt.filters
        });
      }
    })
  }

  loadPluginConfigItemsLazy(event: LazyLoadEvent) {
    this.gridLoading = true;
    this.pluginConfigItemService.getPluginConfigItems(event, this.plugin);
  }

  deletePluginConfigItemWithButton(pluginConfigItem: PluginConfigItem) {
    this.confirmationService.confirm({
        message: $localize `Are you sure that you want to delete this item?`,
        accept: () => {
          this.gridLoading = true;
          /*this.userService.deleteUser(user).pipe(
            takeUntil(this.componentDestroyed$)
          ).subscribe(
            () => {
                this.alertService.success($localize `User has been sucessfully deleted.`, 'OK');
                const index = this.users.indexOf(user);
                this.users = this.users.filter((_, i) => i !== index);
                this.gridLoading = false;
            },
            (error: ApolloError) => {
              this.alertService.error($localize `User deletion failed.`, error.message);
              this.gridLoading = false;
            });*/
        }
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
