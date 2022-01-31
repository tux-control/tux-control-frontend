import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { RoleService } from '@app/core/services/role.service';
import { AlertService } from '@app/core/services/alert.service';
import { Role } from '@app/core/models/role';

import { Table } from 'primeng/table';
import { takeUntil } from 'rxjs/operators';
import { PagedResult } from '@app/core/models/paged-result';
import { ResponseError } from '@app/core/models/response-error';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  @ViewChild('dt') dt!: Table;
  roles!: Role[];
  selectedRoles!: Role[];
  totalRecords!: number;
  gridLoading!: boolean;
  cols!: any[];

  filterRole: Role | undefined;

  constructor(
    private roleService: RoleService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.gridLoading = true;
    this.cols = [
        { field: 'name', header: $localize `Name`, filterMatchMode: 'contains' },
    ];

    this.roleService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((rolePagedResult: PagedResult<Role>) => {
      this.gridLoading = false;
      this.roles = rolePagedResult.data;
      this.totalRecords = rolePagedResult.total;
    });

    this.roleService.onDelete$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((role: Role) => {
      this.alertService.success($localize `Role has been sucessfully deleted.`, 'OK');
      const index = this.roles.indexOf(role);
      this.roles = this.roles.filter((roleFind: Role) => roleFind.id !== role.id);
      this.gridLoading = false;
    });

    this.roleService.onDeleteError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `Role deletion failed.`, responseError.message);
      this.gridLoading = false;
    });
  }

  loadRolesLazy(event: LazyLoadEvent) {
    this.gridLoading = true;
    this.roleService.getRoles(event);
  }

  deleteRoleWithButton(role: Role) {
    this.confirmationService.confirm({
        message: $localize `Are you sure that you want to delete this role?`,
        accept: () => {
          this.gridLoading = true;
          this.roleService.deleteRole(role);
        }
    });
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
